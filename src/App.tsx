import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { useLazyQuery } from "@apollo/client";
import type { Match, PlayerData, PlayerFilters } from "@/types/global";
import { GET_PERFORMERS } from "./apollo/queries";
import { type StashFindPerformersResultType } from "./apollo/schema";
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
  const [matchList, setMatchList] = useState<Match[]>([]);
  const [filters, setFilters] = useState<PlayerFilters>({
    genders: ["FEMALE"],
    limit: 10,
  });

  console.log("players", players);
  console.log("matchList", matchList);

  /* --------------------------------------- New tournament --------------------------------------- */

  const [fetchPerformers, fetchPerformersResponse] =
    useLazyQuery<StashFindPerformersResultType>(GET_PERFORMERS, {
      variables: filters,
    });

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
    });
  };

  /* ------------------------------------------ Settings ------------------------------------------ */

  /** Handler for wiping all current tournament progress. */
  const handleWipeTournament = () => {
    setPlayers([]);
    setMatchList([]);
    setTournament(null);
  };

  /** Handler for saving tournament settings. */
  const handleSaveSettings = (updatedFilters: PlayerFilters) => {
    handleWipeTournament();
    setFilters(updatedFilters);
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
          element={<TournamentPage matchList={matchList} players={players} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
