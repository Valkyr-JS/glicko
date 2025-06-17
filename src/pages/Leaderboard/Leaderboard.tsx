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
    }).then((res) => {
      if (!res.data || res.error) {
        // Throw an error
        setGameError({
          name: "Processing error",
          message:
            "There was an error in fetching performer data while loading your leaderboard.",
          details: res.error,
        });

        // Update the processing state
        setProcessing(false);
        return;
      }

      let allStashPerformers = res.data.findPerformers.performers;

      const pageLimit = Math.ceil(res.data.findPerformers.count / perPage);
      page++;

      const getRemainingPages = async () => {
        while (page <= pageLimit) {
          const nextPage = await queryAllStashPerformers({
            variables: { page, perPage },
          });

          if (!nextPage.data || nextPage.error) {
            // Throw an error
            setGameError({
              name: "Processing error",
              message:
                "There was an error in fetching performer data while loading your leaderboard.",
              details: nextPage.error,
            });

            // Update the processing state
            setProcessing(false);
            return;
          }

          allStashPerformers = [
            ...allStashPerformers,
            ...nextPage.data.findPerformers.performers,
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

  const handleCloseErrorModal = () => {
    setGameError(null);
    setShowGameErrorModal(false);
  };

  if (processing)
    return (
      <main className={styles.Leaderboard}>
        <div className="container">
          <div>Loading...</div>
          <nav>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => props.setActivePage("HOME")}
            >
              Back
            </button>
          </nav>
        </div>
      </main>
    );

  if (performers.length === 0)
    return (
      <main className={styles.Leaderboard}>
        <div className="container">
          <div>No data currently available.</div>
          <nav>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => props.setActivePage("HOME")}
            >
              Back
            </button>
          </nav>
        </div>
      </main>
    );

  return (
    <>
      <main className={styles.Leaderboard}>
        <div className="container">
          <h1>Leaderboard</h1>
          <RankingList performers={performers} sessionHistory={[]} />
          <nav>
            <button
              type="button"
              className="btn btn-secondary"
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
