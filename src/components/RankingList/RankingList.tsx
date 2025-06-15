import React from "react";
import styles from "./RankingList.module.scss";

interface RankingListProps {}

const RankingList: React.FC<RankingListProps> = (props) => {
  console.log("RankingList", props);
  return <section className={styles.RankingList}>RankingList</section>;
};

export default RankingList;
