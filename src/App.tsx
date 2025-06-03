import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import type { PlayerFilters } from "@/types/global";
import { PATH } from "./constants";
import HomePage from "./pages/Home/Home";
import SettingsPage from "./pages/Settings/Settings";

const changeSettingsHandler = () => console.log("changeSettingsHandler");
const continueTournamentHandler = () =>
  console.log("continueTournamentHandler");
const newTournamentHandler = () => console.log("newTournamentHandler");

function App() {
  /* -------------------------------------- State management -------------------------------------- */

  const [tourneyInProgress] = useState(false);
  const [filters, setFilters] = useState<PlayerFilters>({
    genders: ["FEMALE"],
    limit: 20,
  });

  /* --------------------------------------------- App -------------------------------------------- */

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={PATH.HOME}
          element={
            <HomePage
              changeSettingsHandler={changeSettingsHandler}
              continueTournamentHandler={continueTournamentHandler}
              inProgress={tourneyInProgress}
              newTournamentHandler={newTournamentHandler}
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
