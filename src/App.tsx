import { useState } from "react";
import {
  useLazyQuery,
  useQuery,
  type OperationVariables,
  type QueryResult,
} from "@apollo/client";
import { ZodError } from "zod/v4";
import {
  GET_MATCH_PERFORMERS,
  GET_PERFORMER_IMAGE,
  GET_STASH_VERSION,
} from "./apollo/queries";
import {
  StashFindPerformersResultSchema,
  StashVersionSchema,
  type StashFindImages,
  type StashFindPerformersResultType,
  type StashImage,
  type StashPerformer,
  type StashVersion,
} from "./apollo/schema";
import FiltersPage from "./pages/Filters/Filters";
import GamePage from "./pages/Game/Game";
import HomePage from "./pages/Home/Home";
import { GLICKO } from "./constants";

function App() {
  /* -------------------------------------- State management -------------------------------------- */

  const [activePage, setActivePage] = useState<Pages>("HOME");
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [gameError, setGameError] = useState<GameError | null>(null);
  const [gameLoading, setGameLoading] = useState(false);
  const [performerFilters, setPerformerFilters] = useState<PerformerFilters>({
    genders: [],
  });
  const [results] = useState<GlickoMatchResult[]>([]);

  /* ---------------------------------------- Stash queries --------------------------------------- */

  const queryStashVersion: QueryResult<StashVersion, OperationVariables> =
    useQuery(GET_STASH_VERSION);
  try {
    StashVersionSchema.safeParse(queryStashVersion);
  } catch (error) {
    if (error instanceof ZodError) {
      setGameError({
        name: error.name,
        message: error.message,
        details: error,
      });
    }
  }

  const [queryStashPerformerMatch, stashPerformerMatchResponse] =
    useLazyQuery(GET_MATCH_PERFORMERS);
  const [queryStashPerformerImage] = useLazyQuery(GET_PERFORMER_IMAGE);
  const [getPerformerImage] =
    useLazyQuery<StashFindImages>(GET_PERFORMER_IMAGE);

  /* ------------------------------------------ Handlers ------------------------------------------ */

  /** Handle changing the performer image. */
  const handleChangeImage = async (
    performerID: StashPerformer["id"],
    currentImageID: StashImage["id"]
  ) =>
    queryStashPerformerImage({
      variables: { performerID, currentImageID },
    });

  const handleClearGameError = () => setGameError(null);

  /** Handler for saving changing to the performer filters. */
  const handleSaveFilters = (updatedFilters: PerformerFilters) =>
    setPerformerFilters(updatedFilters);

  const handleStartGame = async () => {
    setGameLoading(true);

    // Get the first set of performers
    const matchResponse: QueryResult<
      StashFindPerformersResultType,
      OperationVariables
    > = await queryStashPerformerMatch({ variables: performerFilters });

    try {
      StashFindPerformersResultSchema.safeParse(matchResponse);
    } catch (error) {
      if (error instanceof ZodError) {
        setGameError({
          name: error.name,
          message: error.message,
          details: error,
        });
      }
    }

    console.log(matchResponse);

    if (!matchResponse.data) {
      setGameError({
        name: "Performer data could not be found.",
        message: "Performer data could not be retrieved from Stash.",
      });
      return setGameLoading(false);
    }
    if (matchResponse.data.findPerformers.count < 2) {
      setGameError({
        name: "Not enough performers",
        message:
          "Less than two performers were found using your current filters. Update your filters to allow more performers.",
      });
      return setGameLoading(false);
    }

    // Process the response
    const matchPerformers: Promise<MatchPerformer>[] =
      matchResponse.data.findPerformers.performers.map(async (p) => {
        const imagesAvailable =
          (await getPerformerImage({
            variables: { performerID: p.id, currentImageID: 0 },
          }).then((res) => res.data && res.data.findImages.count > 1)) ?? false;

        return {
          coverImg: p.image_path,
          id: p.id,
          imagesAvailable,
          initialRating: p.custom_fields.glicko_rating ?? GLICKO.RATING_DEFAULT,
          name: p.name,
        };
      });

    const resolvedPlayers = await Promise.all(matchPerformers);

    // Update the state
    setCurrentMatch([resolvedPlayers[0], resolvedPlayers[1]]);

    // Refresh the data for the next match
    stashPerformerMatchResponse.refetch();

    // Set the game as ready
    setGameLoading(false);

    // Load the game page
    setActivePage("GAME");
  };

  /* ------------------------------------------- Router ------------------------------------------- */

  switch (activePage) {
    case "HOME":
      return (
        <HomePage
          clearGameError={handleClearGameError}
          gameError={gameError}
          gameLoading={gameLoading}
          setActivePage={setActivePage}
          startGameHandler={handleStartGame}
          versionData={queryStashVersion.data ?? null}
          versionError={queryStashVersion.error}
          versionLoading={queryStashVersion.loading}
        />
      );

    case "FILTERS":
      return (
        <FiltersPage
          filters={performerFilters}
          saveFiltersHandler={handleSaveFilters}
          setActivePage={setActivePage}
        />
      );

    case "GAME":
      return (
        <GamePage
          changeImageHandler={handleChangeImage}
          match={currentMatch}
          matchIndex={results.length}
          results={results}
          setActivePage={setActivePage}
          setDrawHandler={() => console.log("Set draw handler")}
          setWinnerHandler={() => console.log("Set winner handler")}
          submitHandler={() => console.log("Submit handler")}
          undoMatchHandler={() => console.log("Set undo match handler")}
          wipeResultsHandler={() => console.log("Wipe results handler")}
        />
      );
  }
}

export default App;
