import type { Match, PlayerData } from "@/types/global";
import React from "react";

interface ResultsProps {
  /** The list of matches, including scores if they have been played. */
  matchList: Match[];
  /** The data for all players involved in the tournament. */
  players: PlayerData[];
}

const Results: React.FC<ResultsProps> = (props) => {
  console.log(props);

  return <section>Results</section>;
};

export default Results;
