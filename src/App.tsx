import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { useQuery } from "@apollo/client";
import type { PlayerFilters } from "@/types/global";
import { GET_PERFORMERS } from "./apollo/queries";
import { PATH } from "./constants";
import HomePage from "./pages/Home/Home";
import SettingsPage from "./pages/Settings/Settings";
import {
  StashFindPerformersResultSchema,
  type StashFindPerformersResultType,
} from "./apollo/schema";

const continueTournamentHandler = () =>
  console.log("continueTournamentHandler");

function App() {
  /* -------------------------------------- State management -------------------------------------- */

  const [tourneyInProgress] = useState(false);
  const [filters, setFilters] = useState<PlayerFilters>({
    genders: ["FEMALE"],
    limit: 20,
  });

  const { loading, error, data } = useQuery<StashFindPerformersResultType>(
    GET_PERFORMERS,
    {
      variables: filters,
    }
  );

  useEffect(() => {
    if (error) {
      console.log(error.message);
    } else if (!loading) {
      StashFindPerformersResultSchema.safeParseAsync(data);
      console.log(data);
    }
  }, [data, error, loading]);

  /* --------------------------------------------- App -------------------------------------------- */

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={PATH.HOME}
          element={
            <HomePage
              continueTournamentHandler={continueTournamentHandler}
              inProgress={tourneyInProgress}
              isLoading={loading}
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
