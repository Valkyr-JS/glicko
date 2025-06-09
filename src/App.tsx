import { useState } from "react";
import { useQuery } from "@apollo/client";
import { Glicko2 } from "glicko2";
import type { Pages } from "@/types/global";
import { GET_STASH_VERSION } from "./apollo/queries";
import HomePage from "./pages/Home/Home";
// import SettingsPage from "./pages/Settings/Settings";
// import TournamentPage from "./pages/Tournament/Tournament";
// import ResultsPage from "./pages/Results/ResultsPage";

function App() {
  /* -------------------------------------- State management -------------------------------------- */

  const [activePage, setActivePage] = useState<Pages>("HOME");
  const [tournament] = useState<Glicko2 | null>(null);

  const queryStashVersion = useQuery(GET_STASH_VERSION);

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
