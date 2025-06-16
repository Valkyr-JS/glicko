import React from "react";
import type { StashPerformer } from "@/apollo/schema";
import RankingList from "@/components/RankingList/RankingList";
import styles from "./Leaderboard.module.scss";

interface LeaderboardPageProps extends PageProps {
  /** The performer data including their glicko data. */
  performers: StashPerformer[];
  /** The array of ISO datetime strings of when each session concluded. */
  sessionHistory: Date[];
}

const LeaderboardPage: React.FC<LeaderboardPageProps> = (props) => {
  return (
    <main className={styles.Leaderboard}>
      <div className="container">
        <h1>Leaderboard</h1>
        <RankingList
          performers={props.performers}
          sessionHistory={props.sessionHistory}
        />
      </div>
    </main>
  );
};

export default LeaderboardPage;
