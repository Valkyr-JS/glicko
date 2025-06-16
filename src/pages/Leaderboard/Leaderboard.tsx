import React from "react";
import type { StashPerformer } from "@/apollo/schema";
import styles from "./Leaderboard.module.scss";

interface LeaderboardPageProps extends PageProps {
  /** The performer data including their glicko data. */
  performers: StashPerformer[];
  /** The array of ISO datetime strings of when each session concluded. */
  sessionHistory: Date[];
}

const LeaderboardPage: React.FC<LeaderboardPageProps> = (props) => {
  console.log(props);
  return (
    <main className={styles.Leaderboard}>
      <div className="container">Leaderboard</div>
    </main>
  );
};

export default LeaderboardPage;
