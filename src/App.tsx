import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { useLazyQuery } from "@apollo/client";
import type { PlayerFilters } from "@/types/global";
import { GET_PERFORMERS } from "./apollo/queries";
import { type StashFindPerformersResultType } from "./apollo/schema";
import { PATH } from "./constants";
import HomePage from "./pages/Home/Home";
import SettingsPage from "./pages/Settings/Settings";

function App() {
  /* -------------------------------------- State management -------------------------------------- */

  const [tourneyInProgress] = useState(false);
  const [filters, setFilters] = useState<PlayerFilters>({
    genders: ["FEMALE"],
    limit: 20,
  });

  /* --------------------------------------- New tournament --------------------------------------- */

  // Create player data
  const [fetchPerformers, fetchPerformersResponse] =
    useLazyQuery<StashFindPerformersResultType>(GET_PERFORMERS, {
      variables: filters,
    });

  /** Handler for starting a new tournament. The resolved boolean dictates
   * whether a new tournament is ready to start. */
  const handleStartNewTournament = async () => {
    return await fetchPerformers().then((res) => !res.loading && !res.error);
  };

  /* --------------------------------------------- App -------------------------------------------- */

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={PATH.HOME}
          element={
            <HomePage
              inProgress={tourneyInProgress}
              performersFetch={fetchPerformersResponse}
              startNewTournamentHandler={handleStartNewTournament}
            />
          }
        />
        <Route
          path={PATH.SETTINGS}
          element={
            <SettingsPage
              filters={filters}
              inProgress={tourneyInProgress}
              saveSettingsHandler={setFilters}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
