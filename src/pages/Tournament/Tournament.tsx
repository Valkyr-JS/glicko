import React from "react";
import type { Match, PlayerData } from "@/types/global";
import MatchBoard from "@/components/MatchBoard/MatchBoard";

interface TournamentPageProps {
  /** The zero-based index of the current match in the match list. */
  matchIndex: number;
  /** The list of matches, including scores if they have been played */
  matchList: Match[];
  /** The data for all players involved in the tournament. */
  players: PlayerData[];
}

const TournamentPage: React.FC<TournamentPageProps> = (props) => {
  const currentMatch = props.matchList[props.matchIndex];
  const playerA = props.players[currentMatch[0]];
  const playerB = props.players[currentMatch[1]];

  /** Handler for clicking the change player image button. */
  const changeImageHandler = () => console.log("changeImageHandler");
  /** Handler for clicking the pause button. */
  const clickPauseHandler = () => console.log("clickPauseHandler");
  /** Executes when the user selects the winning player. */
  const clickSelectHandler = () => console.log("clickSelectHandler");
  /** Handler for clicking the skip button. */
  const clickSkipHandler = () => console.log("clickSkipHandler");
  /** Handler for clicking the stop button. */
  const clickStopHandler = () => console.log("clickStopHandler");
  /** Handler for clicking the undo button. */
  const clickUndoHandler = () => console.log("clickUndoHandler");

  return (
    <main>
      <MatchBoard
        changeImageHandler={changeImageHandler}
        clickPauseHandler={clickPauseHandler}
        clickSelectHandler={clickSelectHandler}
        clickSkipHandler={clickSkipHandler}
        clickStopHandler={clickStopHandler}
        clickUndoHandler={clickUndoHandler}
        matchIndex={props.matchIndex}
        players={[playerA, playerB]}
      />
    </main>
  );
};

export default TournamentPage;
