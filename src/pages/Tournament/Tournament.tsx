import React from "react";
import type { Match, PlayerData } from "@/types/global";
import MatchBoard from "@/components/MatchBoard/MatchBoard";
import ProgressBoard from "@/components/ProgressBoard";

interface TournamentPageProps {
  /** The zero-based index of the current match in the match list. */
  matchIndex: number;
  /** The list of matches, including scores if they have been played. */
  matchList: Match[];
  /** The data for all players involved in the tournament. */
  players: PlayerData[];
  /** Handle selecting the winner of a match. */
  selectWinnerHandler: (winner: 0 | 1) => void;
  /** Handle reloading the previous match. */
  undoMatchHandler: () => void;
}

const TournamentPage: React.FC<TournamentPageProps> = (props) => {
  const currentMatch = props.matchList[props.matchIndex];
  const playerA = props.players[currentMatch[0]];
  const playerB = props.players[currentMatch[1]];

  /** Handler for clicking the change player image button. */
  const changeImageHandler = () => console.log("changeImageHandler");
  /** Handler for clicking the pause button. */
  const clickPauseHandler = () => console.log("clickPauseHandler");
  /** Handler for clicking the skip button. */
  const clickSkipHandler = () => console.log("clickSkipHandler");
  /** Handler for clicking the stop button. */
  const clickStopHandler = () => console.log("clickStopHandler");

  return (
    <main>
      <MatchBoard
        changeImageHandler={changeImageHandler}
        clickPauseHandler={clickPauseHandler}
        clickSelectHandler={props.selectWinnerHandler}
        clickSkipHandler={clickSkipHandler}
        clickStopHandler={clickStopHandler}
        clickUndoHandler={props.undoMatchHandler}
        matchIndex={props.matchIndex}
        players={[playerA, playerB]}
      />
      <ProgressBoard
        columnTitles={["A", "B"]}
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
