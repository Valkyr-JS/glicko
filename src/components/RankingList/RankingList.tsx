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
    setSorted(sortByRating());
  }, [props.performers, sorted]);

  return (
    <section className={styles.RankingList}>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">Performer</th>
              <th scope="col">Rating</th>
              <th scope="col">Wins</th>
              <th scope="col">Losses</th>
              <th scope="col">Ties</th>
              <th scope="col">Matches</th>
              <th scope="col">Most recent matchup</th>
              <th scope="col">Most recent matchup date</th>
              <th scope="col">Most recent matchup outcome</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, i) => {
              const matchHistory: PerformerMatchRecord[] = JSON.parse(
                p.custom_fields?.glicko_match_history ?? "[]"
              );
              return (
                <tr key={i}>
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
                    <span>
                      {matchHistory.length
                        ? matchHistory.filter((m) => m.r === 1).length
                        : "-"}
                    </span>
                  </td>
                  <td>
                    <span>
                      {matchHistory.length
                        ? matchHistory.filter((m) => m.r === 0).length
                        : "-"}
                    </span>
                  </td>
                  <td>
                    <span>
                      {matchHistory.length
                        ? matchHistory.filter((m) => m.r === 0.5).length
                        : "-"}
                    </span>
                  </td>
                  <td>
                    <span>{matchHistory.length}</span>
                  </td>
                  <td>
                    {matchHistory.length
                      ? props.performers.find(
                          (p) => p.id === +matchHistory[0].id
                        )?.name
                      : "-"}
                  </td>
                  <td>
                    {matchHistory.length
                      ? new Date(matchHistory[0].s).toDateString()
                      : "-"}
                  </td>
                  <td>
                    {matchHistory.length
                      ? matchHistory[0].r === 1
                        ? "Won"
                        : matchHistory[0].r === 0
                        ? "Lost"
                        : "Tie"
                      : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RankingList;
