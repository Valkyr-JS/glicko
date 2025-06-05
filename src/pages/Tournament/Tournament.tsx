import type { PlayerData } from "@/types/global";
import React from "react";

interface TournamentPageProps {
  /** The zero-based index of the current match in the match list. */
  matchIndex: number;
  /** The data for all players involved in the tournament. */
  players: PlayerData[];
}

const TournamentPage: React.FC<TournamentPageProps> = (props) => {
  console.log(props);
  return <main>Tournament page</main>;
};

export default TournamentPage;
