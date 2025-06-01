import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./pages/Home/Home";

const changeFiltersHandler = () => console.log("changeFiltersHandler");
const continueTournamentHandler = () =>
  console.log("continueTournamentHandler");
const newTournamentHandler = () => console.log("newTournamentHandler");
const inProgress = false;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/plugin/glicko/assets/app/"
          element={
            <HomePage
              changeFiltersHandler={changeFiltersHandler}
              continueTournamentHandler={continueTournamentHandler}
              inProgress={inProgress}
              newTournamentHandler={newTournamentHandler}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
