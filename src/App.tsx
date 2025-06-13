import { useEffect, useState } from "react";
import {
  useLazyQuery,
  useMutation,
  useQuery,
  type OperationVariables,
  type QueryResult,
} from "@apollo/client";
import {
  GET_ALL_PERFORMERS_BY_PAGE,
  GET_MATCH_PERFORMERS,
  GET_PERFORMER_IMAGE,
  GET_SPECIFIC_MATCH_PERFORMERS,
  GET_STASH_CONFIGURATION,
  GET_STASH_VERSION,
} from "./apollo/queries";
import {
  StashPluginPerformerFiltersParsed,
  StashPluginUserSettingsParsed,
  type StashConfigResult,
  type StashFindImagesResult,
  type StashFindPerformersResult,
  type StashImage,
  type StashPerformer,
  type StashVersionResult,
} from "./apollo/schema";
import FiltersPage from "./pages/Filters/Filters";
import GamePage from "./pages/Game/Game";
import HomePage from "./pages/Home/Home";
import {
  DEFAULT_PERFORMER_FILTERS,
  DEFAULT_USER_SEETTINGS,
  GLICKO,
} from "./constants";
import { Glicko2, Player } from "glicko2";
import { SET_PLUGIN_CONFIG } from "./apollo/mutations";
import SettingsPage from "./pages/Settings/Settings";

function App() {
  /* -------------------------------------- State management -------------------------------------- */

  const [activePage, setActivePage] = useState<Pages>("HOME");
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [gameError, setGameError] = useState<GameError | null>(null);
  const [gameLoading, setGameLoading] = useState(false);
  const [performerFilters, setPerformerFilters] = useState<PerformerFilters>(
    DEFAULT_PERFORMER_FILTERS
  );
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<GlickoMatchResult[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings>(
    DEFAULT_USER_SEETTINGS
  );

  /* ---------------------------------------- Stash queries --------------------------------------- */

  const queryStashVersionResult: QueryResult<
    StashVersionResult,
    OperationVariables
  > = useQuery(GET_STASH_VERSION);

  const queryStashConfiguration: QueryResult<
    StashConfigResult,
    OperationVariables
  > = useQuery(GET_STASH_CONFIGURATION);

  const [queryAllStashPerformers] = useLazyQuery<StashFindPerformersResult>(
    GET_ALL_PERFORMERS_BY_PAGE
  );
  const [queryStashPerformerMatch, stashPerformerMatchResponse] =
    useLazyQuery<StashFindPerformersResult>(GET_MATCH_PERFORMERS);
  const [querySpecificStashPerformerMatch] =
    useLazyQuery<StashFindPerformersResult>(GET_SPECIFIC_MATCH_PERFORMERS);
  const [queryStashPerformerImage] =
    useLazyQuery<StashFindImagesResult>(GET_PERFORMER_IMAGE);

  // Update the performer filters and user settings with the data from the Stash
  // plugin config, if there is any.
  useEffect(() => {
    // Check performer filters
    if (
      queryStashConfiguration.data?.configuration.plugins.glicko
        ?.performerFilters
    ) {
      const configPerformerFilters =
        queryStashConfiguration.data?.configuration.plugins.glicko
          ?.performerFilters;

      let userPerformerFilters: unknown;
      try {
        userPerformerFilters = JSON.parse(configPerformerFilters);
      } catch (e) {
        setGameError({
          name: "Plugin config error",
          message:
            "There was an issue with your Glicko plugin config in your Stash config.yml file. Using default settings instead.",
          details: e + "",
        });
      }

      // Ensure the received data is valid before updating the state
      StashPluginPerformerFiltersParsed.safeParseAsync(
        userPerformerFilters
      ).then((res) => {
        if (res.error) {
          setGameError({
            name: res.error.name,
            message: res.error.message,
            details: res.error,
          });
        } else setPerformerFilters(userPerformerFilters as PerformerFilters);
      });
    }

    // Check user settings
    if (
      queryStashConfiguration.data?.configuration.plugins.glicko?.userSettings
    ) {
      const configUserSettings =
        queryStashConfiguration.data?.configuration.plugins.glicko
          ?.userSettings;

      let userSettings: unknown;
      try {
        userSettings = JSON.parse(configUserSettings);
      } catch (e) {
        setGameError({
          name: "Plugin config error",
          message:
            "There was an issue with your Glicko plugin config in your Stash config.yml file. Using default settings instead.",
          details: e + "",
        });
      }

      // Ensure the received data is valid before updating the state
      StashPluginUserSettingsParsed.safeParseAsync(userSettings).then((res) => {
        if (res.error) {
          setGameError({
            name: res.error.name,
            message: res.error.message,
            details: res.error,
          });
        } else setUserSettings(userSettings as UserSettings);
      });
    }
  }, [queryStashConfiguration]);

  /* --------------------------------------- Stash mutations -------------------------------------- */

  const [mutateStashPluginConfig] =
    useMutation<StashConfigResult>(SET_PLUGIN_CONFIG);

  /* ------------------------------------------ Handlers ------------------------------------------ */

  /** Get performer data to create a new match. Gets a specific match up between
   * two provided Stash performer IDs, or a random matchup if blank. */
  const createMatch = async (
    ids?: [StashPerformer["id"], StashPerformer["id"]]
  ): Promise<Match | null> => {
    // Use the appropriate query depending on whether specific IDs have been
    // passed.
    const matchResponse: QueryResult<
      StashFindPerformersResult,
      OperationVariables
    > = ids
      ? await querySpecificStashPerformerMatch({
          variables: { ids },
        })
      : await queryStashPerformerMatch({
          variables: performerFilters,
        });

    if (matchResponse.error) {
      setGameError({ ...matchResponse.error, details: matchResponse.error });
      return null;
    }

    if (!matchResponse.data) {
      setGameError({
        name: "Performer data could not be found.",
        message: "Performer data could not be retrieved from Stash.",
      });
      return null;
    }

    if (matchResponse.data.findPerformers.count < 2) {
      setGameError({
        name: "Not enough performers",
        message:
          "Less than two performers were found using your current filters. Update your filters to allow more performers.",
      });
      return null;
    }

    // Process the response
    const matchPerformers: Promise<MatchPerformer>[] =
      matchResponse.data.findPerformers.performers.map(async (p) => {
        const imagesAvailable =
          (await queryStashPerformerImage({
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

    const resolvedPlayers = (await Promise.all(matchPerformers)) as Match;
    return resolvedPlayers;
  };

  /** Handle changing the performer image. */
  const handleChangeImage = async (
    performerID: StashPerformer["id"],
    currentImageID: StashImage["id"]
  ) => {
    return queryStashPerformerImage({
      variables: { performerID, currentImageID },
    }).then((res) => {
      // Process the value
      const updatedMatch = (currentMatch ?? []).map((p) => {
        return +p.id === performerID
          ? { ...p, imageID: res.data?.findImages.images[0].id }
          : p;
      });

      // Update state
      setCurrentMatch(updatedMatch as Match);

      // Refetch in preparation for the next request
      res.refetch();
      return res;
    });
  };

  /** Handle resetting the error state */
  const handleClearGameError = () => setGameError(null);

  /** Handler for updating the performer filters. */
  const handleSaveFilters = async (updatedFilters: PerformerFilters) => {
    // Refetch the config data to ensure it's the latest
    const configData = await queryStashConfiguration.refetch();

    // Create the updated data
    const updatedPluginConfig = {
      ...configData.data.configuration.plugins.glicko,
      performerFilters: JSON.stringify(updatedFilters),
    };

    // Update the config
    await mutateStashPluginConfig({
      variables: { input: updatedPluginConfig },
    });

    // Update the state
    setPerformerFilters(updatedFilters);
  };

  /** Handler for updating the user settings. */
  const handleSaveSettings = async (updatedSettings: UserSettings) => {
    // Refetch the config data to ensure it's the latest
    const configData = await queryStashConfiguration.refetch();

    // Create the updated data
    const updatedPluginConfig = {
      ...configData.data.configuration.plugins.glicko,
      userSettings: JSON.stringify(updatedSettings),
    };

    // Update the config
    await mutateStashPluginConfig({
      variables: { input: updatedPluginConfig },
    });

    // Update the state
    setUserSettings(updatedSettings);
  };

  /** Handler for scoring the match as a draw. */
  const handleSetDraw = async () => {
    if (currentMatch === null) return;

    // Create a match result from the current match. The outcome is based on the
    // result of player 1, where 0 is a loss and 1 is a win
    const result: GlickoMatchResult = [
      currentMatch[0].id,
      currentMatch[1].id,
      0.5,
    ];

    // Update the results
    setResults([...results, result]);

    // Create a new match
    const resolvedPlayers = await createMatch();

    // Update the state
    setCurrentMatch(resolvedPlayers);

    // Refresh the data for the next match
    stashPerformerMatchResponse.refetch();
  };

  /** Handler for setting the winner of a match. */
  const handleSetWinner = async (winnerIndex: 0 | 1) => {
    if (currentMatch === null) return;

    // Create a match result from the current match. The outcome is based on the
    // result of player 1, where 0 is a loss and 1 is a win
    const outcome = winnerIndex === 0 ? 1 : 0;
    const result: GlickoMatchResult = [
      currentMatch[0].id,
      currentMatch[1].id,
      outcome,
    ];

    // Update the results
    setResults([...results, result]);

    // Create a new match
    const resolvedPlayers = await createMatch();

    // Update the state
    setCurrentMatch(resolvedPlayers);

    // Refresh the data for the next match
    stashPerformerMatchResponse.refetch();
  };

  /** Handle starting a new game. */
  const handleStartGame = async () => {
    // Set the game as loading
    setGameLoading(true);

    // Create a match
    const resolvedPlayers = await createMatch();

    if (resolvedPlayers === null) {
      setGameLoading(false);
      setActivePage("HOME");
      return;
    }

    // Update the state
    setCurrentMatch(resolvedPlayers);

    // Refresh the data for the next match
    stashPerformerMatchResponse.refetch();

    // Set the game as ready
    setGameLoading(false);

    // Load the game page
    setActivePage("GAME");
  };

  /** Handle submitting results of a session */
  const handleSubmitResults = async () => {
    // Update the processing state
    setProcessing(true);

    // Create a tournament
    const tournament = new Glicko2();

    // Get ALL performers from Stash
    let page = 1;
    const perPage = 25;

    // Get the first page of performers
    const firstPage = await queryAllStashPerformers({
      variables: { page, perPage },
    });

    if (!firstPage.data || firstPage.error) {
      // Throw an error
      setGameError({
        name: "Processing error",
        message:
          "There was an error in fetching performer data while processing your results.",
        details: firstPage.error,
      });

      // Update the processing state
      setProcessing(false);
      return;
    }

    let allStashPerformers = firstPage.data.findPerformers.performers;

    const pageLimit = Math.ceil(firstPage.data.findPerformers.count / perPage);
    page++;

    const getRemainingPages = async () => {
      while (page <= pageLimit) {
        const nextPage = await queryAllStashPerformers({
          variables: { page, perPage },
        });

        if (!nextPage.data || nextPage.error) {
          // Throw an error
          setGameError({
            name: "Processing error",
            message:
              "There was an error in fetching performer data while processing your results.",
            details: nextPage.error,
          });

          // Update the processing state
          setProcessing(false);
          return;
        }

        allStashPerformers = [
          ...allStashPerformers,
          ...nextPage.data.findPerformers.performers,
        ];
        page++;
      }
    };

    await getRemainingPages();

    // Create Glicko players from ALL performers in Stash
    const allGlickoPerformers = allStashPerformers.map((p) => {
      const rating = p.custom_fields.glicko_rating ?? GLICKO.RATING_DEFAULT;
      const deviation =
        p.custom_fields.glicko_deviation ?? GLICKO.DEVIATION_DEFAULT;
      const volatility =
        p.custom_fields.glicko_volatility ?? GLICKO.VOLATILITY_DEFAULT;

      return {
        ...p,
        glicko: tournament.makePlayer(rating, deviation, volatility),
      };
    });

    // Loop through results and create tournament matches using the IDs
    const matches = results.map((r) => {
      // Get players
      const player1 = allGlickoPerformers.find((p) => p.id === r[0]);
      const player2 = allGlickoPerformers.find((p) => p.id === r[1]);

      return [player1?.glicko, player2?.glicko, r[2]] as [
        Player,
        Player,
        0 | 1 | 0.5
      ];
    });

    // Update the tournament
    tournament.updateRatings(matches);

    // TODO - Update Stash performer data with results

    // Update the processing state
    setProcessing(false);

    // Go to the home page
    setActivePage("HOME");
  };

  /** Handle undoing the previous match result */
  const handleUndoMatch = async () => {
    const lastMatch = results[results.length - 1];

    // Remove the previous result
    const updatedResults = results.slice(0, -1);
    setResults(updatedResults);

    // Create a new match
    const resolvedPlayers = await createMatch([lastMatch[0], lastMatch[1]]);

    // Update the state
    setCurrentMatch(resolvedPlayers);

    // Refresh the data for the next match
    stashPerformerMatchResponse.refetch();
  };

  /** Handle clearing all results */
  const handleWipeResults = () => {
    // Clear the state
    setCurrentMatch(null);
    setResults([]);

    // Return to homepage
    setActivePage("HOME");
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
          versionData={queryStashVersionResult.data ?? null}
          versionError={queryStashVersionResult.error}
          versionLoading={queryStashVersionResult.loading}
        />
      );

    case "FILTERS":
      return (
        <FiltersPage
          filters={performerFilters}
          saveFiltersHandler={handleSaveFilters}
          setActivePage={setActivePage}
          stashConfig={queryStashConfiguration.data?.configuration}
        />
      );

    case "GAME":
      if (currentMatch)
        return (
          <GamePage
            changeImageHandler={handleChangeImage}
            gameError={gameError}
            match={currentMatch}
            matchIndex={results.length}
            processingResults={processing}
            results={results}
            setActivePage={setActivePage}
            setDrawHandler={handleSetDraw}
            setWinnerHandler={handleSetWinner}
            submitHandler={handleSubmitResults}
            undoMatchHandler={handleUndoMatch}
            wipeResultsHandler={handleWipeResults}
          />
        );
      else
        return (
          <HomePage
            clearGameError={handleClearGameError}
            gameError={gameError}
            gameLoading={gameLoading}
            setActivePage={setActivePage}
            startGameHandler={handleStartGame}
            versionData={queryStashVersionResult.data ?? null}
            versionError={queryStashVersionResult.error}
            versionLoading={queryStashVersionResult.loading}
          />
        );
    case "SETTINGS":
      return (
        <SettingsPage
          saveSettingsHandler={handleSaveSettings}
          setActivePage={setActivePage}
          settings={userSettings}
        />
      );
  }
}

export default App;
