import { useEffect, useState } from "react";
import {
  useLazyQuery,
  useMutation,
  useQuery,
  type OperationVariables,
  type QueryResult,
} from "@apollo/client";
import {
  GET_ALL_PERFORMERS_WITH_HISTORY_BY_PAGE,
  GET_MATCH_PERFORMERS,
  GET_MATCH_PERFORMERS_NO_CUSTOM,
  GET_PERFORMER_IMAGE,
  GET_PERFORMERS_BY_ID,
  GET_SPECIFIC_MATCH_PERFORMERS,
  GET_SPECIFIC_MATCH_PERFORMERS_NO_CUSTOM,
  GET_STASH_CONFIGURATION,
  GET_STASH_VERSION,
} from "./apollo/queries";
import {
  StashFindImagesSchema,
  StashFindPerformersResultSchema,
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
  DEFAULT_USER_SETTINGS,
  GLICKO,
} from "./constants";
import { Glicko2, Player } from "glicko2";
import { SET_PERFORMER_DATA, SET_PLUGIN_CONFIG } from "./apollo/mutations";
import SettingsPage from "./pages/Settings/Settings";
import {
  getStashVersionBreakdown,
  handleStashMutationError,
  handleStashQueryError,
  queryStashPerformersPage,
  wipePerformerCustomFields,
} from "./helpers/stash";
import LeaderboardPage from "./pages/Leaderboard/Leaderboard";
import { getPerformerOutcomeFromRecord } from "./helpers/gameplay";

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
  const [slimPerformerData, setSlimPerformerData] = useState<
    StashSlimPerformerData[]
  >([]);
  const [stashVersion, setStashVersion] = useState<StashAppVersion | null>(
    null
  );
  const [userSettings, setUserSettings] = useState<UserSettings>(
    DEFAULT_USER_SETTINGS
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

  // Don't cache all performer data in case it changes between fetches. Caching
  // would run the risk of losing data if a user opened Glicko, added a new
  // custom field to a performer, then wiped their performer data via the button
  // in settings. The new data wouldn't be cached, so would be lost. It's an
  // unlikely occurance, but better to be safe.
  const [queryAllStashPerformersWithHistory] =
    useLazyQuery<StashFindPerformersResult>(
      GET_ALL_PERFORMERS_WITH_HISTORY_BY_PAGE,
      {
        fetchPolicy: "no-cache",
      }
    );

  const [queryStashPerformersByID] = useLazyQuery<StashFindPerformersResult>(
    GET_PERFORMERS_BY_ID,
    {
      fetchPolicy: "no-cache",
    }
  );

  const [queryStashPerformerMatch, stashPerformerMatchResponse] =
    useLazyQuery<StashFindPerformersResult>(
      stashVersion && stashVersion?.[1] < 28
        ? GET_MATCH_PERFORMERS_NO_CUSTOM
        : GET_MATCH_PERFORMERS
    );
  const [querySpecificStashPerformerMatch] =
    useLazyQuery<StashFindPerformersResult>(
      stashVersion && stashVersion?.[1] < 28
        ? GET_SPECIFIC_MATCH_PERFORMERS_NO_CUSTOM
        : GET_SPECIFIC_MATCH_PERFORMERS
    );
  const [queryStashPerformerImage] =
    useLazyQuery<StashFindImagesResult>(GET_PERFORMER_IMAGE);

  useEffect(() => {
    if (queryStashVersionResult.data?.version?.version) {
      setStashVersion(
        getStashVersionBreakdown(queryStashVersionResult.data?.version?.version)
      );
    } else setStashVersion(null);
  }, [queryStashVersionResult]);

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

  const [mutateStashPerformer] =
    useMutation<StashPerformer>(SET_PERFORMER_DATA);

  /* ------------------------------------------ Handlers ------------------------------------------ */

  /** Get performer data to create a new match. Gets a specific match up between
   * two provided Stash performer IDs, or a random matchup if blank. */
  const createMatch = async (
    ids?: [StashPerformer["id"], StashPerformer["id"]]
  ): Promise<Match | null> => {
    // Exclude one of the performers in the previous match from appearing in
    // this match.
    const excludeIndex = Math.round(Math.random()) as 0 | 1;
    const excludedName = currentMatch?.length
      ? slimPerformerData.find((s) => s.id === currentMatch[excludeIndex].id)
          ?.name ?? ""
      : "";

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
          variables: { ...performerFilters, exclude: excludedName },
        });

    // Check for errors
    const matchResponseVerified = handleStashQueryError(
      matchResponse,
      setGameError,
      "Performer data"
    );
    if (!matchResponseVerified) return null;

    if (matchResponseVerified.findPerformers.count < 2) {
      setGameError({
        name: "Not enough performers",
        message:
          "Less than two performers were found using your current filters. Update your filters to allow more performers.",
      });
      return null;
    }

    // Process the response
    const matchPerformers: Promise<MatchPerformer>[] =
      matchResponseVerified.findPerformers.performers.map(async (p) => {
        let imagesError = false;

        const findImages = await queryStashPerformerImage({
          variables: { performerID: p.id, currentImageID: 0 },
        });

        if (findImages.error) {
          setGameError({ ...findImages.error, details: findImages.error });
          imagesError = true;
        }

        if (!findImages.data) {
          setGameError({
            name: "Image data could not be found.",
            message: "Image data could not be retrieved from Stash.",
            details: findImages,
          });
          imagesError = true;
        }

        StashFindImagesSchema.safeParseAsync(findImages.data).then((res) => {
          if (res.error) {
            setGameError({
              name: res.error.name,
              message: res.error.message,
              details: res.error,
            });
            imagesError = true;
          }
        });

        const imagesAvailable = imagesError
          ? false
          : (findImages.data && findImages.data.findImages.count > 1) ?? false;

        return {
          coverImg: p.image_path,
          id: p.id,
          imagesAvailable,
          initialRating:
            p.custom_fields?.glicko_rating ?? GLICKO.RATING_DEFAULT,
          name: p.name,
        };
      });

    const resolvedPlayers = (await Promise.all(matchPerformers)) as Match;

    // Add a slimmed version of the data for use in other components, unless
    // they have already been added to it.
    const additionalSlimData: StashSlimPerformerData[] = [];

    resolvedPlayers.forEach((p) => {
      const exists = slimPerformerData.findIndex((s) => s.id === p.id) !== -1;
      if (!exists) {
        additionalSlimData.push({
          id: p.id,
          name: p.name,
        });
      }
    });

    if (additionalSlimData.length)
      setSlimPerformerData([...slimPerformerData, ...additionalSlimData]);

    return resolvedPlayers;
  };

  /** Handle changing the performer image. */
  const handleChangeImage = async (
    performerID: StashPerformer["id"],
    currentImageID: StashImage["id"]
  ) => {
    const imageResponse = await queryStashPerformerImage({
      variables: { performerID, currentImageID },
    });

    // Check for errors
    const imageResponseVerified = handleStashQueryError(
      imageResponse,
      setGameError,
      "Performer image data"
    );
    if (!imageResponseVerified) return null;

    StashFindImagesSchema.safeParseAsync(imageResponseVerified).then((res) => {
      if (res.error) {
        setGameError({
          name: res.error.name,
          message: res.error.message,
          details: res.error,
        });
        return null;
      }
    });

    // Process the value
    const updatedMatch = (currentMatch ?? []).map((p) => {
      return +p.id === performerID
        ? { ...p, imageID: imageResponseVerified.findImages.images[0].id }
        : p;
    });

    // Update state
    setCurrentMatch(updatedMatch as Match);

    // Refetch in preparation for the next request
    imageResponse.refetch();
    return imageResponse;
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
    const mutationResponse = await mutateStashPluginConfig({
      variables: { input: updatedPluginConfig },
    });

    // Check for errors
    const mutationResponseVerified = handleStashMutationError(
      mutationResponse,
      setGameError,
      "Plugin performer filters"
    );

    if (mutationResponseVerified === null) return null;

    // Update the state
    setPerformerFilters(updatedFilters);

    await queryStashConfiguration.refetch();
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
    const mutationResponse = await mutateStashPluginConfig({
      variables: { input: updatedPluginConfig },
    });

    const mutationResponseVerified = handleStashMutationError(
      mutationResponse,
      setGameError,
      "Performer filters "
    );

    if (mutationResponseVerified === null) return null;

    // Update the state
    setUserSettings(updatedSettings);

    await queryStashConfiguration.refetch();
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

    // Create a session
    const session = new Glicko2();

    // Get performers with history from Stash
    let page = 1;
    const perPage = 25;

    // Get the first page of performers with history
    const firstPage = await queryAllStashPerformersWithHistory({
      variables: { page, perPage },
    });

    const firstPageVerified = await queryStashPerformersPage(
      firstPage,
      setGameError,
      setProcessing
    );
    if (!firstPageVerified) return null;

    let allStashPerformers: StashPerformer[] =
      firstPageVerified.findPerformers.performers;

    const pageLimit = Math.ceil(
      firstPageVerified.findPerformers.count / perPage
    );
    page++;

    // Get the remaining pages of performers
    while (page <= pageLimit) {
      const nextPage = await queryAllStashPerformersWithHistory({
        variables: { page, perPage },
      });

      const nextPageVerified = await queryStashPerformersPage(
        nextPage,
        setGameError,
        setProcessing
      );
      if (!nextPageVerified) return null;

      allStashPerformers = [
        ...allStashPerformers,
        ...nextPageVerified.findPerformers.performers,
      ];
      page++;
    }

    // Create an array of performer IDs from the session that haven't yet been
    // pulled.
    const newPerformerIDs: StashPerformer["id"][] = [];
    for (const r of results) {
      if (
        allStashPerformers.findIndex((d) => +d.id === +r[0]) === -1 &&
        !newPerformerIDs.includes(+r[0])
      )
        newPerformerIDs.push(+r[0]);
      if (
        allStashPerformers.findIndex((d) => +d.id === +r[1]) === -1 &&
        !newPerformerIDs.includes(+r[1])
      )
        newPerformerIDs.push(+r[1]);
    }

    if (newPerformerIDs.length) {
      // Can't paginate Stash queries for performers by performer_ids, so do it
      // manually.
      const paginatedNewPerformerIDs: StashPerformer["id"][][] = [];
      const paginateLimit = Math.ceil(newPerformerIDs.length / perPage);
      for (let pg = 0; pg < paginateLimit; pg++) {
        const pageIDs: StashPerformer["id"][] = [];
        for (let i = 0; i < perPage; i++) {
          const idIndex = pg * perPage + i;
          if (newPerformerIDs[idIndex]) pageIDs.push(newPerformerIDs[idIndex]);
          else break;
        }
        paginatedNewPerformerIDs.push(pageIDs);
      }

      // Get each page of new performers and add it to the all performers array.
      for (let pg = 0; pg < paginatedNewPerformerIDs.length; pg++) {
        const newPage = await queryStashPerformersByID({
          variables: { ids: paginatedNewPerformerIDs[pg] },
        });

        // Check for errors
        const newPageVerified = await queryStashPerformersPage(
          newPage,
          setGameError,
          setProcessing
        );

        if (!newPageVerified) return null;

        // Add it to the array
        allStashPerformers = [
          ...allStashPerformers,
          ...newPageVerified.findPerformers.performers,
        ];
        newPage.refetch();
      }
    }

    // Create Glicko players then sort them by name then rating.
    const allGlickoPerformers = allStashPerformers
      .map((p) => {
        const rating = p.custom_fields?.glicko_rating ?? GLICKO.RATING_DEFAULT;
        const deviation =
          p.custom_fields?.glicko_deviation ?? GLICKO.DEVIATION_DEFAULT;
        const volatility =
          p.custom_fields?.glicko_volatility ?? GLICKO.VOLATILITY_DEFAULT;

        return {
          ...p,
          glicko: session.makePlayer(rating, deviation, volatility),
        };
      })
      .sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      })
      .sort(
        (a, b) =>
          (b.custom_fields?.glicko_rating ?? GLICKO.RATING_DEFAULT) -
          (a.custom_fields?.glicko_rating ?? GLICKO.RATING_DEFAULT)
      );

    // Loop through results and create session matches using the IDs
    const matches = results.map((r) => {
      // Get players
      const player1 = allGlickoPerformers.find((p) => +p.id === +r[0]);
      const player2 = allGlickoPerformers.find((p) => +p.id === +r[1]);

      return [player1?.glicko, player2?.glicko, r[2]] as [
        Player,
        Player,
        0 | 1 | 0.5
      ];
    });

    // Update the session
    session.updateRatings(matches);

    // Get the previous session records from the config
    const sessionHistory: string[] = JSON.parse(
      queryStashConfiguration.data?.configuration.plugins.glicko
        ?.sessionHistory ?? "[]"
    );

    // Get the current ISO date and push it to the history
    const sessionDatetime = new Date().toISOString();
    const updatedHistory: string[] = [...sessionHistory, sessionDatetime];

    // Update the plugin config with the new session history
    const mutationResponse = await mutateStashPluginConfig({
      variables: {
        input: {
          ...queryStashConfiguration.data?.configuration.plugins.glicko,
          sessionHistory: JSON.stringify(updatedHistory),
          totalPerformers: allGlickoPerformers.length,
        },
      },
    });

    // Check for errors, but don't exit the function if it fails.
    handleStashMutationError(
      mutationResponse,
      setGameError,
      "Plugin session history"
    );

    await queryStashConfiguration.refetch();

    // Update Stash performer data with results unless the user is in read-only
    // mode or the Stash version doesn't support custom fields
    if (!userSettings.readOnly && !(stashVersion && stashVersion[1] < 28)) {
      // Session history requires the performers to be sorted by rating in order
      // to get their rank. Once sorted, the rank can be assigned. Performers with
      // equal ratings should have an equal rank; compare the current and previous
      // performer.
      const allSortedPerformers = allGlickoPerformers.sort(
        (a, b) => b.glicko.getRating() - a.glicko.getRating()
      );

      let rank = 1;
      allSortedPerformers.forEach(async (p, i) => {
        // Create match history for the performer
        const performerResults = results.filter(
          (r) => r[0] === p.id || r[1] === p.id
        );

        const sessionMatchHistory: PerformerMatchRecord[] =
          performerResults.map((r) => ({
            id: +r[0] === +p.id ? r[1] : r[0],
            r: r[0] === p.id ? r[2] : r[2] === 1 ? 0 : 1,
            s: sessionDatetime,
          }));

        const previousMatchHistory = p.custom_fields?.glicko_match_history
          ? (JSON.parse(
              p.custom_fields.glicko_match_history
            ) as PerformerMatchRecord[])
          : [];

        // If the user has set to record minimal match history, reduce the
        // match history to a maximum of one record.
        const fullMatchHistory = [
          ...previousMatchHistory,
          ...sessionMatchHistory,
        ];
        const sizedMatchHistory = userSettings.minimalHistory
          ? fullMatchHistory.slice(Math.max(fullMatchHistory.length - 1, 0))
          : fullMatchHistory;

        const glicko_match_history = JSON.stringify(sizedMatchHistory);

        const glicko_deviation = p.glicko.getRd();
        const glicko_rating = p.glicko.getRating();
        const glicko_volatility = p.glicko.getVol();

        // Create wins, losses and ties
        const glicko_wins =
          (p.custom_fields?.glicko_wins ?? 0) +
          [...performerResults].filter(
            (r) => getPerformerOutcomeFromRecord(+p.id, r) === 1
          ).length;
        const glicko_losses =
          (p.custom_fields?.glicko_losses ?? 0) +
          [...performerResults].filter(
            (r) => getPerformerOutcomeFromRecord(+p.id, r) === 0
          ).length;
        const glicko_ties =
          (p.custom_fields?.glicko_ties ?? 0) +
          [...performerResults].filter(
            (r) => getPerformerOutcomeFromRecord(+p.id, r) === 0.5
          ).length;

        // Create session history
        const previousSessionHistory = p.custom_fields?.glicko_session_history
          ? (JSON.parse(
              p.custom_fields.glicko_session_history
            ) as PerformerSessionRecord[])
          : [];

        const previousPerformer = allSortedPerformers[i - 1];
        if (previousPerformer) {
          const previousRating = previousPerformer.glicko.getRating();
          if (previousRating !== glicko_rating) {
            rank = i + 1;
          }
        }

        // If the user has set to record minimal match history, reduce the
        // session history to a maximum of two records.
        const fullSessionHistory = [
          ...previousSessionHistory,
          {
            d: sessionDatetime,
            g: glicko_rating,
            n: rank,
          },
        ];
        const sizedSessionHistory = userSettings.minimalHistory
          ? fullSessionHistory.slice(Math.max(fullSessionHistory.length - 2, 0))
          : fullSessionHistory;

        const glicko_session_history = JSON.stringify(sizedSessionHistory);

        const performerMutationResponse = await mutateStashPerformer({
          variables: {
            input: {
              id: p.id,
              custom_fields: {
                partial: {
                  glicko_deviation,
                  glicko_losses,
                  glicko_match_history,
                  glicko_rating,
                  glicko_session_history,
                  glicko_ties,
                  glicko_volatility,
                  glicko_wins,
                },
              },
            },
          },
        });

        // Check for errors, but don't exit the function if it fails.
        handleStashMutationError(
          performerMutationResponse,
          setGameError,
          "Performer custom field"
        );
      });
    }

    // Clear the state of session progress
    setResults([]);
    setCurrentMatch(null);

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

  /** Handle wiping all Glicko data from all Stash performers */
  const handleWipePerformerData = async () => {
    // Remove session history and total performers properties from the config.
    const disallowedKeys = ["sessionHistory", "totalPerformers"];

    const validKeys = Object.keys(
      queryStashConfiguration.data?.configuration.plugins.glicko ?? {}
    ).filter((k) => !disallowedKeys.includes(k));

    const updatedConfig = validKeys.reduce(
      (obj, key) => ({
        ...obj,
        [key]: (
          queryStashConfiguration.data?.configuration.plugins.glicko as {
            [key: string]: unknown;
          }
        )[key],
      }),
      {}
    );

    const mutationResponse = await mutateStashPluginConfig({
      variables: {
        input: updatedConfig,
      },
    });

    // Check for errors
    const mutationResponseVerified = handleStashMutationError(
      mutationResponse,
      setGameError,
      "Plugin session history"
    );

    if (mutationResponseVerified === null) return null;
    await queryStashConfiguration.refetch();

    // Fetch data for all performers to get all performers from Stash
    // Get ALL performers from Stash
    let page = 1;
    const perPage = 25;

    // Get the first page of performers
    const firstPage = await queryAllStashPerformersWithHistory({
      variables: { page: 1, perPage },
    });

    // Check for errors
    const firstPageVerified = handleStashQueryError(
      firstPage,
      setGameError,
      "All performers"
    );
    if (!firstPageVerified) {
      setProcessing(false);
      return null;
    }

    StashFindPerformersResultSchema.safeParseAsync(firstPageVerified).then(
      (res) => {
        if (res.error) {
          setGameError({
            name: res.error.name,
            message: res.error.message,
            details: res.error,
          });
          setProcessing(false);
          return null;
        }
      }
    );

    // Wipe the data from performers in the first page
    firstPageVerified.findPerformers.performers.forEach((p) =>
      wipePerformerCustomFields(p, mutateStashPerformer)
    );

    const pageLimit = Math.ceil(
      firstPageVerified.findPerformers.count / perPage
    );
    page++;

    while (page <= pageLimit) {
      // Always query for the first page of results - as data is being removed,
      // there are fewer pages of results in the next query.
      const nextPage = await queryAllStashPerformersWithHistory({
        variables: { page: 1, perPage },
      });

      // Check for errors
      const nextPageVerified = handleStashQueryError(
        nextPage,
        setGameError,
        "All performers"
      );
      if (!nextPageVerified) {
        setProcessing(false);
        return null;
      }

      StashFindPerformersResultSchema.safeParseAsync(nextPageVerified).then(
        (res) => {
          if (res.error) {
            setGameError({
              name: res.error.name,
              message: res.error.message,
              details: res.error,
            });
            setProcessing(false);
            return null;
          }
        }
      );

      nextPageVerified.findPerformers.performers.forEach((p) =>
        wipePerformerCustomFields(p, mutateStashPerformer)
      );
      page++;
    }
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
            imageQuality={userSettings.imageQuality}
            match={currentMatch}
            matchIndex={results.length}
            performerData={slimPerformerData}
            processingResults={processing}
            results={results}
            setActivePage={setActivePage}
            setDrawHandler={handleSetDraw}
            setWinnerHandler={handleSetWinner}
            submitHandler={handleSubmitResults}
            undoMatchHandler={handleUndoMatch}
            userSettings={userSettings}
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
    case "LEADERBOARD":
      return <LeaderboardPage setActivePage={setActivePage} />;
    case "SETTINGS":
      return (
        <SettingsPage
          saveSettingsHandler={handleSaveSettings}
          setActivePage={setActivePage}
          settings={userSettings}
          wipeDataHandler={handleWipePerformerData}
        />
      );
  }
}

export default App;
