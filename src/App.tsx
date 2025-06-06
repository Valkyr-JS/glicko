import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { useLazyQuery } from "@apollo/client";
import type { Match, PlayerData, PlayerFilters } from "@/types/global";
import { GET_PERFORMER_IMAGE, GET_PERFORMERS } from "./apollo/queries";
import {
  type StashFindImages,
  type StashFindPerformersResultType,
  type StashImage,
  type StashPerformer,
} from "./apollo/schema";
import { GLICKO, PATH } from "./constants";
import HomePage from "./pages/Home/Home";
import SettingsPage from "./pages/Settings/Settings";
import { Glicko2 } from "glicko2";
import { createRoundRobinMatchList } from "./helpers/gameplay";
import TournamentPage from "./pages/Tournament/Tournament";

function App() {
  /* -------------------------------------- State management -------------------------------------- */

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
    return await fetchPerformers().then((res) => {
      const newTournament = new Glicko2();

      const newPlayers: PlayerData[] = (
        res.data?.findPerformers.performers ?? []
      ).map((p) => {
        return {
          coverImg: p.image_path,
          id: p.id.toString(),
          name: p.name,
          glicko: newTournament.makePlayer(
            p.custom_fields.glicko_rating ?? GLICKO.RATING_DEFAULT,
            p.custom_fields.glicko_deviation ?? GLICKO.DEVIATION_DEFAULT,
            p.custom_fields.glicko_volatility ?? GLICKO.VOLATILITY_DEFAULT
          ),
        };
      });

      // Check there are enough performers before updating
      if (newPlayers.length < 2) return;

      const newMatchList = createRoundRobinMatchList(newPlayers.length);
      setPlayers(newPlayers);
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
    // Update the current match in the match list
    const updatedMatchList: Match[] = matchList.map((m, i) =>
      i === matchIndex ? [m[0], m[1], winner] : m
    );

    setMatchList(updatedMatchList);

    // Load the next match
    setMatchIndex(matchIndex + 1);
  };

  /** Handler for declaring a match a draw  */
  const handleSkipMatch = () => {
    // Update the current match in the match list. 0.5 indicates a draw.
    const updatedMatchList: Match[] = matchList.map((m, i) =>
      i === matchIndex ? [m[0], m[1], 0.5] : m
    );

    setMatchList(updatedMatchList);

    // Load the next match
    setMatchIndex(matchIndex + 1);
  };

  /** Handler reloading the previous match. */
  const handleUndoMatch = () => {
    // Remove the result from the previous match before loading it
    const updatedMatchList: Match[] = matchList.map((m, i) =>
      i === matchIndex - 1 ? [m[0], m[1]] : m
    );

    // Load the previous match
    setMatchList(updatedMatchList);

    // Load the next match
    setMatchIndex(matchIndex - 1);
  };

  /* --------------------------------------------- App -------------------------------------------- */

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={PATH.HOME}
          element={
            <HomePage
              inProgress={!!tournament}
              fetchData={fetchPerformersResponse.data ?? null}
              fetchError={fetchPerformersResponse.error}
              fetchLoading={fetchPerformersResponse.loading}
              startNewTournamentHandler={handleStartNewTournament}
            />
          }
        />
        <Route
          path={PATH.SETTINGS}
          element={
            <SettingsPage
              filters={filters}
              inProgress={!!tournament}
              saveSettingsHandler={handleSaveSettings}
            />
          }
        />
        <Route
          path={PATH.TOURNAMENT}
          element={
            <TournamentPage
              changeImageHandler={handleChangeImage}
              declareDrawHandler={handleSkipMatch}
              matchIndex={matchIndex}
              matchList={matchList}
              players={players}
              selectWinnerHandler={handleSelectWinner}
              undoMatchHandler={handleUndoMatch}
              wipeTournamentHandler={handleWipeTournament}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
