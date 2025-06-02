import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./pages/Home/Home";
import { PATH } from "./constants";

const changeSettingsHandler = () => console.log("changeSettingsHandler");
const continueTournamentHandler = () =>
  console.log("continueTournamentHandler");
const newTournamentHandler = () => console.log("newTournamentHandler");

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
