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

function App() {
  /* -------------------------------------- State management -------------------------------------- */

  const [tourneyInProgress] = useState(false);
  const [filters, setFilters] = useState<PlayerFilters>({
    genders: ["FEMALE"],
    limit: 20,
  });

  const performersFetch = useQuery<StashFindPerformersResultType>(
    GET_PERFORMERS,
    {
      variables: filters,
    }
  );

  useEffect(() => {
    if (performersFetch.error) {
      console.log(performersFetch.error);
    } else if (!performersFetch.loading) {
      StashFindPerformersResultSchema.safeParseAsync(performersFetch.data);
      console.log(performersFetch.data);
    }
  }, [performersFetch.data, performersFetch.error, performersFetch.loading]);

  /* --------------------------------------------- App -------------------------------------------- */

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={PATH.HOME}
          element={
            <HomePage
              inProgress={tourneyInProgress}
              performersFetch={performersFetch}
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
