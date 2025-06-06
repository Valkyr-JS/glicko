import React from "react";
import { useNavigate } from "react-router";
import MatchBoard from "@/components/MatchBoard/MatchBoard";
import ProgressBoard from "@/components/ProgressBoard";
import { PATH } from "@/constants";
import type { Match, PlayerData } from "@/types/global";

interface TournamentPageProps {
  /** Handler for declaring a match a draw. */
  declareDrawHandler: () => void;
  /** The zero-based index of the current match in the match list. */
  matchIndex: number;
  /** The list of matches, including scores if they have been played. */
  matchList: Match[];
  /** The data for all players involved in the tournament. */
  players: PlayerData[];
  /** Handler selecting the winner of a match. */
  selectWinnerHandler: (winner: 0 | 1) => void;
  /** Handler reloading the previous match. */
  undoMatchHandler: () => void;
  /** Handler clearing all tournament data. */
  wipeTournamentHandler: () => void;
}

const TournamentPage: React.FC<TournamentPageProps> = (props) => {
  const navigate = useNavigate();

  if (!props.matchList.length) return null;

  const currentMatch = props.matchList[props.matchIndex];
  const playerA = props.players[currentMatch[0]];
  const playerB = props.players[currentMatch[1]];

  /** Handler for clicking the change player image button. */
  const changeImageHandler = () => console.log("changeImageHandler");
  /** Handler for clicking the pause button. */
  const clickPauseHandler = () => console.log("clickPauseHandler");

  /** Handler for clicking the stop button. */
  const handleAbandonTournament = () => {
    // Navigate home
    navigate(PATH.HOME);

    // Clear all tournament data
    props.wipeTournamentHandler();
  };

  return (
    <main>
      <MatchBoard
        changeImageHandler={changeImageHandler}
        clickPauseHandler={clickPauseHandler}
        clickSelectHandler={props.selectWinnerHandler}
        clickSkipHandler={props.declareDrawHandler}
        clickStopHandler={handleAbandonTournament}
        clickUndoHandler={props.undoMatchHandler}
        matchIndex={props.matchIndex}
        players={[playerA, playerB]}
      />
      <ProgressBoard
        columnTitles={["Performer A", "Performer B"]}
        reverse
        tableData={props.matchList
          .filter((m) => m.length === 3)
          .map((m) => [
            props.players[m[0]].name,
            props.players[m[1]].name,
            m[2],
          ])}
      />
    </main>
  );
};

export default TournamentPage;
