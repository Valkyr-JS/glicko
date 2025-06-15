import React, { useEffect, useState } from "react";
import type { StashPerformer } from "@/apollo/schema";
import styles from "./RankingList.module.scss";
import { GLICKO } from "@/constants";

interface RankingListProps {
  /** The performer data including their glicko data. */
  performers: StashPerformer[];
  /** The array of ISO datetime strings of when each session concluded. */
  sessionHistory: Date[];
}

const RankingList: React.FC<RankingListProps> = (props) => {
  /* ------------------------------------------- Sorting ------------------------------------------ */

  const [sorted, setSorted] = useState<StashPerformer[]>(props.performers);

  useEffect(() => {
    const sortByRating = () => {
      const newSort = sorted.sort(
        (a, b) =>
          (b.custom_fields?.glicko_rating ?? GLICKO.RATING_DEFAULT) -
          (a.custom_fields?.glicko_rating ?? GLICKO.RATING_DEFAULT)
      );
      return newSort;
    };
    console.log(sortByRating());
    setSorted(sortByRating());
  }, [props.performers, sorted]);

  return (
    <section className={styles.RankingList}>
      <table className="table table-striped">
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
          {sorted.map((p, i) => (
            <tr>
              <th scope="row">
                <span>{i + 1}</span>
              </th>
              <td>{p.name}</td>
              <td>
                <span>
                  {Math.round(
                    p.custom_fields?.glicko_rating ?? GLICKO.RATING_DEFAULT
                  )}
                </span>
              </td>
              <td>
                <span>???</span>
              </td>
              <td>???</td>
              <td>???</td>
              <td>
                <span>???</span>
              </td>
              <td>???</td>
              <td>???</td>
              <td>???</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default RankingList;
