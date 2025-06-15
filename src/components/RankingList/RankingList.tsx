import React from "react";
import type { StashPerformer } from "@/apollo/schema";
import styles from "./RankingList.module.scss";

interface RankingListProps {
  /** The performer data including their glicko data. */
  performers: StashPerformer[];
  /** The array of ISO datetime strings of when each session concluded. */
  sessionHistory: string[];
}

const RankingList: React.FC<RankingListProps> = (props) => {
  console.log("RankingList", props);
  return <section className={styles.RankingList}>RankingList</section>;
};

export default RankingList;
