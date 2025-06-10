import { useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { ZodError } from "zod/v4";
import { GET_PERFORMER_IMAGE, GET_STASH_VERSION } from "./apollo/queries";
import {
  StashVersionSchema,
  type StashImage,
  type StashPerformer,
} from "./apollo/schema";
import FiltersPage from "./pages/Filters/Filters";
import GamePage from "./pages/Game/Game";
import HomePage from "./pages/Home/Home";

function App() {
  /* -------------------------------------- State management -------------------------------------- */

  const [activePage, setActivePage] = useState<Pages>("HOME");
  const [gameError, setGameError] = useState<GameError | null>(null);
  const [gameLoading] = useState(false);
  const [currentMatch] = useState<Match | null>(null);
  const [results] = useState<GlickoMatchResult[]>([]);
  const [performerFilters, setPerformerFilters] = useState<PerformerFilters>({
    genders: [],
  });

  /* ---------------------------------------- Stash queries --------------------------------------- */

  const queryStashVersion = useQuery(GET_STASH_VERSION);
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

  const [queryStashPerformerImage] = useLazyQuery(GET_PERFORMER_IMAGE);

  /* ------------------------------------------ Handlers ------------------------------------------ */

  /** Handle changing the performer image. */
  const handleChangeImage = async (
    performerID: StashPerformer["id"],
    currentImageID: StashImage["id"]
  ) =>
    queryStashPerformerImage({
      variables: { performerID, currentImageID },
    });

  /** Handler for saving changing to the performer filters. */
  const handleSaveFilters = (updatedFilters: PerformerFilters) =>
    setPerformerFilters(updatedFilters);

  /* ------------------------------------------- Router ------------------------------------------- */

  switch (activePage) {
    case "HOME":
      return (
        <HomePage
          gameError={gameError}
          gameLoading={gameLoading}
          setActivePage={setActivePage}
          startGameHandler={() => console.log("Start game")}
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
