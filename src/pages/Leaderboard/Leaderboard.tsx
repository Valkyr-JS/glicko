import React, { useEffect, useState } from "react";
import RankingList from "@/components/RankingList/RankingList";
import styles from "./Leaderboard.module.scss";
import { useLazyQuery } from "@apollo/client";
import type {
  StashPerformer,
  StashFindPerformersResult,
} from "@/apollo/schema";
import { GET_ALL_PERFORMERS_WITH_HISTORY_BY_PAGE } from "@/apollo/queries";
import { GameErrorModal } from "@/components/Modal/Modal";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { queryStashPerformersPage } from "@/helpers/stash";

const LeaderboardPage: React.FC<PageProps> = (props) => {
  const [gameError, setGameError] = useState<GameError | null>(null);
  const [processing, setProcessing] = useState(false);
  const [performers, setPerformers] = useState<StashPerformer[]>([]);
  const [showGameErrorModal, setShowGameErrorModal] = useState(false);

  // Fetch data on entering the page
  const [queryAllStashPerformers] = useLazyQuery<StashFindPerformersResult>(
    GET_ALL_PERFORMERS_WITH_HISTORY_BY_PAGE,
    {
      fetchPolicy: "no-cache",
    }
  );

  useEffect(() => {
    // Get ALL performers from Stash
    let page = 1;
    const perPage = 25;
    setProcessing(true);

    // Get the first page of performers
    queryAllStashPerformers({
      variables: { page, perPage },
    }).then(async (res) => {
      const resVerified = await queryStashPerformersPage(
        res,
        setGameError,
        setProcessing
      );
      if (!resVerified) return null;

      let allStashPerformers = resVerified.findPerformers.performers;
      const pageLimit = Math.ceil(resVerified.findPerformers.count / perPage);
      page++;

      const getRemainingPages = async () => {
        while (page <= pageLimit) {
          const nextPage = await queryAllStashPerformers({
            variables: { page, perPage },
          });

          const nextVerified = await queryStashPerformersPage(
            nextPage,
            setGameError,
            setProcessing
          );

          if (!nextVerified) return null;

          allStashPerformers = [
            ...allStashPerformers,
            ...nextVerified.findPerformers.performers,
          ];
          page++;
        }
      };

      getRemainingPages().then(() => {
        setPerformers(allStashPerformers);
        setProcessing(false);
      });
    });
  }, [queryAllStashPerformers]);

  /** Handler for closing the error modal. */
  const handleCloseErrorModal = () => {
    setGameError(null);
    setShowGameErrorModal(false);
  };

  /* --------------------------------------- Body component --------------------------------------- */

  const formatData = (): RankedPerformer[] => {
    // Convert performer data to RankedPerformer
    const rankedPerformers: RankedPerformer[] = performers.map((p) => {
      const losses = p.custom_fields?.glicko_losses ?? 0;
      const ties = p.custom_fields?.glicko_ties ?? 0;
      const wins = p.custom_fields?.glicko_wins ?? 0;

      const matchHistory = JSON.parse(
        p.custom_fields?.glicko_match_history ?? "[]"
      ) as PerformerMatchRecord[];
      const lastMatch = matchHistory[matchHistory.length - 1];

      const sessionHistory = JSON.parse(
        p.custom_fields?.glicko_session_history ?? "[]"
      ) as PerformerSessionRecord[];
      const lastSession = sessionHistory[sessionHistory.length - 1];

      const opponent = performers.find((p) => p.id === lastMatch.id)?.name;

      return {
        id: p.id,
        losses,
        matches: losses + ties + wins,
        name: p.name,
        rank: lastSession.n,
        rating: p.custom_fields?.glicko_rating ?? 0,
        recentOpponent: {
          date: new Date(lastMatch.s),
          id: lastMatch.id,
          name: opponent ?? "",
          outcome: lastMatch.r,
        },
        ties,
        wins,
      };
    });

    return rankedPerformers;
  };

  // The component that is rendered depends on the loading status and makeup of
  // the data
  const bodyComponent = processing ? (
    <LoadingSpinner />
  ) : gameError ? (
    <div>An error occured.</div>
  ) : performers.length === 0 ? (
    <div>No data currently available.</div>
  ) : (
    <RankingList performers={formatData()} sessionHistory={[]} />
  );

  /* ------------------------------------------ Component ----------------------------------------- */

  return (
    <>
      <main className={styles.Leaderboard}>
        <div className="container">
          <h1>Leaderboard</h1>
          {bodyComponent}
          <nav className={styles["button-container"]}>
            <button
              type="button"
              className="btn btn-secondary ml-auto"
              onClick={() => props.setActivePage("HOME")}
            >
              Back
            </button>
          </nav>
        </div>
      </main>
      <GameErrorModal
        closeHandler={handleCloseErrorModal}
        gameError={gameError}
        show={showGameErrorModal}
      />
    </>
  );
};

export default LeaderboardPage;
