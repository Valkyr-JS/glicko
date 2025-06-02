import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./pages/Home/Home";
import { PATH } from "./constants";
import SettingsPage from "./pages/Settings/Settings";
import type { PlayerFilters } from "@/types/global";

const changeSettingsHandler = () => console.log("changeSettingsHandler");
const continueTournamentHandler = () =>
  console.log("continueTournamentHandler");
const newTournamentHandler = () => console.log("newTournamentHandler");

const filters: PlayerFilters = {};
const saveSettingsHandler = () => console.log("saveSettingsHandler");

function App() {
  /* -------------------------------------- State management -------------------------------------- */

  const [tourneyInProgress] = useState(false);

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
              saveSettingsHandler={saveSettingsHandler}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
