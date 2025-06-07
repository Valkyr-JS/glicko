import { useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { Glicko2 } from "glicko2";
import type {
  GlickoPlayer,
  Match,
  Pages,
  PlayerData,
  PlayerFilters,
} from "@/types/global";
import { GET_PERFORMER_IMAGE, GET_PERFORMERS } from "./apollo/queries";
import {
  type StashFindImages,
  type StashFindPerformersResultType,
  type StashImage,
  type StashPerformer,
} from "./apollo/schema";
import { GLICKO } from "./constants";
import { createRoundRobinMatchList } from "./helpers/gameplay";
import HomePage from "./pages/Home/Home";
import SettingsPage from "./pages/Settings/Settings";
import TournamentPage from "./pages/Tournament/Tournament";
import ResultsPage from "./pages/Results/ResultsPage";

function App() {
  /* -------------------------------------- State management -------------------------------------- */

  const [activePage, setActivePage] = useState<Pages>("HOME");
  const [tournament, setTournament] = useState<Glicko2 | null>(null);
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [matchIndex, setMatchIndex] = useState(0);
  const [matchList, setMatchList] = useState<Match[]>([]);
  const [filters, setFilters] = useState<PlayerFilters>({
    genders: ["FEMALE"],
    limit: 10,
  });

  const [fetchPerformers, fetchPerformersResponse] =
    useLazyQuery<StashFindPerformersResultType>(GET_PERFORMERS, {
      variables: filters,
    });
  const [getPerformerImage] =
    useLazyQuery<StashFindImages>(GET_PERFORMER_IMAGE);

  /* --------------------------------------- New tournament --------------------------------------- */

  /** Handler for starting a new tournament. The resolved boolean dictates
   * whether a new tournament is ready to start. */
  const handleStartNewTournament = async (): Promise<void> => {
    return await fetchPerformers().then(async (res) => {
      const newTournament = new Glicko2();

      const newPlayers: Promise<PlayerData>[] = (
        res.data?.findPerformers.performers ?? []
      ).map(async (p) => {
        const imagesAvailable =
          (await getPerformerImage({
            variables: { performerID: p.id, currentImageID: 0 },
          }).then((res) => res.data && res.data.findImages.count > 1)) ?? false;

        return {
          coverImg: p.image_path,
          id: p.id.toString(),
          imagesAvailable,
          initialRating: p.custom_fields.glicko_rating ?? GLICKO.RATING_DEFAULT,
          name: p.name,
          glicko: newTournament.makePlayer(
            p.custom_fields.glicko_rating ?? GLICKO.RATING_DEFAULT,
            p.custom_fields.glicko_deviation ?? GLICKO.DEVIATION_DEFAULT,
            p.custom_fields.glicko_volatility ?? GLICKO.VOLATILITY_DEFAULT
          ) as GlickoPlayer,
        };
      });

      // Check there are enough performers before updating
      const resolvedPlayers = await Promise.all(newPlayers);
      if (resolvedPlayers.length < 2) return;

      const newMatchList = createRoundRobinMatchList(resolvedPlayers.length);
      setPlayers(resolvedPlayers);
      setMatchList(newMatchList);
      setTournament(newTournament);

      // Refetch data ready for the next tournament, assuming the settings
      // aren't changed. If they are, this will be done anyway.
      fetchPerformersResponse.refetch();
    });
  };

  /* ------------------------------------------ Settings ------------------------------------------ */

  /** Handler for wiping all current tournament progress. */
  const handleWipeTournament = () => {
    setMatchIndex(0);
    setMatchList([]);
    setPlayers([]);
    setTournament(null);
  };

  /** Handler for saving tournament settings. */
  const handleSaveSettings = (updatedFilters: PlayerFilters) => {
    handleWipeTournament();
    setFilters(updatedFilters);
  };

  /* ----------------------------------------- Tournament ----------------------------------------- */

  const handleChangeImage = async (
    performerID: StashPerformer["id"],
    currentImageID: StashImage["id"]
  ) => {
    return getPerformerImage({
      variables: { performerID, currentImageID },
    }).then((res) => {
      if (res.data) {
        const findImages = res.data.findImages;
        const updatedPlayers: PlayerData[] = players.map((p) => {
          const { id } = findImages.images[0];
          return p.id === performerID.toString()
            ? {
                ...p,
                imageID: id.toString(),
              }
            : p;
        });
        setPlayers(updatedPlayers);
      }

      // Referch to clear the cache
      res.refetch();
      return res;
    });
  };

  /** Handler selecting the winner of a match */
  const handleSelectWinner = (winner: 0 | 1) => {
    /** Update the current match in the match list. The winner value is
     * inverted, as the score is based on whether player 1 won or lost: 1 ===
     * player 1 won, 0 === player 1 lost. Essentially the value the index of the
     * loser. See the "Usage" section of the npm page for info
     * https://www.npmjs.com/package/glicko2 */
    const updatedMatchList: Match[] = matchList.map((m, i) =>
      i === matchIndex ? [m[0], m[1], winner === 0 ? 1 : 0] : m
    );

    setMatchList(updatedMatchList);

    // Load the next match if one is available
    if (matchIndex + 1 < matchList.length) setMatchIndex(matchIndex + 1);
  };

  /** Handler for declaring a match a draw  */
  const handleSkipMatch = () => {
    // Update the current match in the match list. 0.5 indicates a draw.
    const updatedMatchList: Match[] = matchList.map((m, i) =>
      i === matchIndex ? [m[0], m[1], 0.5] : m
    );

    setMatchList(updatedMatchList);

    // Load the next match if one is available
    if (matchIndex + 1 < matchList.length) setMatchIndex(matchIndex + 1);
  };

  /** Handler reloading the previous match. */
  const handleUndoMatch = () => {
    // Remove the result from the previous match before loading it
    const updatedMatchList: Match[] = matchList.map((m, i) =>
      i === matchIndex - 1 ? [m[0], m[1]] : m
    );

    // Update the match results
    setMatchList(updatedMatchList);

    // Load the previous match
    setMatchIndex(matchIndex - 1);
  };

  const processResults = () => {
    const tournamentMatchList: [GlickoPlayer, GlickoPlayer, 0 | 0.5 | 1][] =
      matchList.map((m) => {
        return [
          players[m[0]].glicko,
          players[m[1]].glicko,
          m[2] as 0 | 0.5 | 1,
        ];
      });

    tournament?.updateRatings(tournamentMatchList);
  };

  /* ------------------------------------------- Router ------------------------------------------- */

  switch (activePage) {
    case "HOME":
      return (
        <HomePage
          activePage={activePage}
          inProgress={!!tournament}
          fetchData={fetchPerformersResponse.data ?? null}
          fetchError={fetchPerformersResponse.error}
          fetchLoading={fetchPerformersResponse.loading}
          setActivePage={setActivePage}
          startNewTournamentHandler={handleStartNewTournament}
        />
      );

    case "RESULTS":
      return (
        <ResultsPage
          activePage={activePage}
          matchList={matchList.map((m) => [m[0], m[1], m[2] ?? 0.5])}
          players={players}
          setActivePage={setActivePage}
          wipeTournamentHandler={handleWipeTournament}
        />
      );

    case "SETTINGS":
      return (
        <SettingsPage
          activePage={activePage}
          filters={filters}
          inProgress={!!tournament}
          saveSettingsHandler={handleSaveSettings}
          setActivePage={setActivePage}
        />
      );

    case "TOURNAMENT":
      return (
        <TournamentPage
          activePage={activePage}
          changeImageHandler={handleChangeImage}
          declareDrawHandler={handleSkipMatch}
          matchIndex={matchIndex}
          matchList={matchList}
          players={players}
          processResultsHandler={processResults}
          selectWinnerHandler={handleSelectWinner}
          setActivePage={setActivePage}
          undoMatchHandler={handleUndoMatch}
          wipeTournamentHandler={handleWipeTournament}
        />
      );
  }
}

export default App;
