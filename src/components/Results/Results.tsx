import React, { useState } from "react";
import { default as cx } from "classnames";
import type { PlayerData } from "@/types/global";
import styles from "./Results.module.scss";

interface ResultsProps {
  /** The list of matches, including scores if they have been played. */
  matchList: [playerA: number, playerB: number, result: 0 | 1 | 0.5][];
  /** The data for all players involved in the tournament. */
  players: PlayerData[];
}

const Results: React.FC<ResultsProps> = (props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sortedPlayers = props.players.sort((a, b) => {
    return b.glicko.getRating() - a.glicko.getRating();
  });

  /** Handler for toggling the table to display all columns and allow scrolling
   * if needed. */
  const handleToggleExpand = () => setIsExpanded(!isExpanded);

  const tableWrapperClasses = cx({ "table-responsive": isExpanded });
  const expandButtonClasses = cx("btn", "btn-primary", styles["expand-button"]);

  return (
    <section className={styles.Results}>
      <button
        type="button"
        className={expandButtonClasses}
        onClick={handleToggleExpand}
      >
        {isExpanded ? "Collapse columns" : "Expand columns"}
      </button>
      <div className={tableWrapperClasses}>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Performer</th>
              <th scope="col">New rating</th>
              <th scope="col">Previous rating</th>
              <th scope="col">Rating change</th>
              <th scope="col">W : L : D</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((p, i) => {
              const newRating = Math.round(p.glicko.getRating());
              const outcomes = p.glicko.outcomes as (0 | 0.5 | 1)[];
              const wins = outcomes.filter((o) => o === 1).length;
              const loses = outcomes.filter((o) => o === 0).length;
              const draws = outcomes.filter((o) => o === 0.5).length;
              return (
                <tr key={i}>
                  <th scope="row">{i + 1}</th>
                  <td>{p.name}</td>
                  <td>{newRating}</td>
                  <td>{p.initialRating}</td>
                  <td>{newRating - p.initialRating}</td>
                  <td>
                    {wins} : {loses} : {draws}
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

export default Results;
