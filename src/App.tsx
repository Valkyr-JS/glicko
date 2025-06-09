import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_STASH_VERSION } from "./apollo/queries";
import HomePage from "./pages/Home/Home";
// import SettingsPage from "./pages/Settings/Settings";
// import TournamentPage from "./pages/Tournament/Tournament";
// import ResultsPage from "./pages/Results/ResultsPage";

function App() {
  /* -------------------------------------- State management -------------------------------------- */

  const [activePage, setActivePage] = useState<Pages>("HOME");
  const [gameError] = useState<GameError | null>(null);
  const [gameLoading] = useState(false);

  const queryStashVersion = useQuery(GET_STASH_VERSION);

  /* ------------------------------------------- Router ------------------------------------------- */

  switch (activePage) {
    case "HOME":
      return (
        <HomePage
          activePage={activePage}
          gameError={gameError}
          gameLoading={gameLoading}
          setActivePage={setActivePage}
          startGameHandler={() => console.log("Start game")}
          versionData={queryStashVersion.data ?? null}
          versionError={queryStashVersion.error}
          versionLoading={queryStashVersion.loading}
        />
      );

    // case "RESULTS":
    //   return (
    //     <ResultsPage
    //       activePage={activePage}
    //       matchList={matchList.map((m) => [m[0], m[1], m[2] ?? 0.5])}
    //       players={players}
    //       setActivePage={setActivePage}
    //       wipeTournamentHandler={handleWipeTournament}
    //     />
    //   );

    // case "SETTINGS":
    //   return (
    //     <SettingsPage
    //       activePage={activePage}
    //       filters={filters}
    //       inProgress={!!tournament}
    //       saveSettingsHandler={handleSaveSettings}
    //       setActivePage={setActivePage}
    //     />
    //   );

    // case "TOURNAMENT":
    //   return (
    //     <TournamentPage
    //       activePage={activePage}
    //       changeImageHandler={handleChangeImage}
    //       declareDrawHandler={handleSkipMatch}
    //       matchIndex={matchIndex}
    //       matchList={matchList}
    //       players={players}
    //       processResultsHandler={processResults}
    //       selectWinnerHandler={handleSelectWinner}
    //       setActivePage={setActivePage}
    //       undoMatchHandler={handleUndoMatch}
    //       wipeTournamentHandler={handleWipeTournament}
    //     />
    //   );
  }
}

export default App;
