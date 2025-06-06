import type { PlayerData } from "@/types/global";
import React from "react";
import styles from "./Results.module.scss";

interface ResultsProps {
  /** The list of matches, including scores if they have been played. */
  matchList: [playerA: number, playerB: number, result: 0 | 1 | 0.5][];
  /** The data for all players involved in the tournament. */
  players: PlayerData[];
}

const Results: React.FC<ResultsProps> = (props) => {
  console.log(props);

  const sortedPlayers = props.players.sort((a, b) => {
    return b.glicko.getRating() - a.glicko.getRating();
  });

  console.log("sorted", sortedPlayers);

  return (
    <section className={styles.Results}>
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
    </section>
  );
};

export default Results;
