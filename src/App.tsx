import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./pages/Home/Home";
import { useState } from "react";

const changeFiltersHandler = () => console.log("changeFiltersHandler");
const continueTournamentHandler = () =>
  console.log("continueTournamentHandler");
const newTournamentHandler = () => console.log("newTournamentHandler");

const basePath = "/plugin/glicko/assets/app/";

function App() {
  /* -------------------------------------- State management -------------------------------------- */

  const [tourneyInProgress] = useState(false);

  /* --------------------------------------------- App -------------------------------------------- */

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={basePath}
          element={
            <HomePage
              changeFiltersHandler={changeFiltersHandler}
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
