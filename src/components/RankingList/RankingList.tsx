import React from "react";
import type { StashPerformer } from "@/apollo/schema";
import styles from "./RankingList.module.scss";

interface RankingListProps {
  /** The performer data including their glicko data. */
  performers: StashPerformer[];
  /** The array of ISO datetime strings of when each session concluded. */
  sessionHistory: Date[];
}

const RankingList: React.FC<RankingListProps> = (props) => {
  console.log("RankingList", props);
  return (
    <section className={styles.RankingList}>
      <table className="table">
        <thead>
          <tr>
            <th scope="column">Rank</th>
            <th scope="column">Performer</th>
            <th scope="column">Rating</th>
            <th scope="column">Total wins</th>
            <th scope="column">Total loses</th>
            <th scope="column">Total ties</th>
            <th scope="column">Total matches</th>
            <th scope="column">Most recent matchup</th>
            <th scope="column">Most recent matchup data</th>
            <th scope="column">Most recent matchup outcome</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">
              <span>1</span>
              <span>+1</span>
            </th>
            <td>Performer A</td>
            <td>
              <span>2000</span>
              <span>+500</span>
            </td>
            <td>
              <span>2</span>
              <span>+1</span>
            </td>
            <td>0</td>
            <td>0</td>
            <td>
              <span>2</span>
              <span>+1</span>
            </td>
            <td>Player B</td>
            <td>01/1/2025</td>
            <td>Won</td>
          </tr>
          <tr>
            <th scope="row">
              <span>2</span>
              <span>-1</span>
            </th>
            <td>Performer B</td>
            <td>
              <span>1500</span>
              <span>-500</span>
            </td>
            <td>1</td>
            <td>
              <span>1</span>
              <span>+1</span>
            </td>
            <td>0</td>
            <td>
              <span>2</span>
              <span>+1</span>
            </td>
            <td>Player A</td>
            <td>01/1/2025</td>
            <td>Lost</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Performer C</td>
            <td>
              <span>1500</span>
            </td>
            <td>0</td>
            <td>2</td>
            <td>0</td>
            <td>2</td>
            <td>Player A</td>
            <td>31/12/2024</td>
            <td>Lost</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};

export default RankingList;
