import React, { useState } from "react";
import { default as cx } from "classnames";
import { useNavigate } from "react-router";
import MatchBoard from "@/components/MatchBoard/MatchBoard";
import ProgressBoard from "@/components/ProgressBoard";
import { PATH } from "@/constants";
import type { Match, PlayerData } from "@/types/global";
import Modal from "@/components/Modal/Modal";
import { faHand } from "@fortawesome/pro-solid-svg-icons/faHand";
import { faPartyHorn } from "@fortawesome/pro-solid-svg-icons/faPartyHorn";
import type {
  StashFindImages,
  StashImage,
  StashPerformer,
} from "@/apollo/schema";
import type { OperationVariables, QueryResult } from "@apollo/client";
import styles from "./Tournament.module.scss";

interface TournamentPageProps {
  /** Handler for setting a new performer image */
  changeImageHandler: (
    performerID: StashPerformer["id"],
    currentImageID: StashImage["id"]
  ) => Promise<QueryResult<StashFindImages, OperationVariables>>;
  /** Handler for declaring a match a draw. */
  declareDrawHandler: () => void;
  /** The zero-based index of the current match in the match list. */
  matchIndex: number;
  /** The list of matches, including scores if they have been played. */
  matchList: Match[];
  /** The data for all players involved in the tournament. */
  players: PlayerData[];
  /** Handle updating the tournament with the match results */
  processResultsHandler: () => void;
  /** Handler selecting the winner of a match. */
  selectWinnerHandler: (winner: 0 | 1) => void;
  /** Handler reloading the previous match. */
  undoMatchHandler: () => void;
  /** Handler clearing all tournament data. */
  wipeTournamentHandler: () => void;
}

const TournamentPage: React.FC<TournamentPageProps> = (props) => {
  const [showAbandonModal, setShowAbandonModal] = useState(false);
  const [showConcludeModal, setShowConcludeModal] = useState(false);
  const navigate = useNavigate();

  if (!props.matchList.length) return null;

  const currentMatch = props.matchList[props.matchIndex];
  const playerA = props.players[currentMatch[0]];
  const playerB = props.players[currentMatch[1]];

  /** Handler for clicking the change player image button. */
  const changeImageHandler = (performerID: StashPerformer["id"]) => {
    const player = playerA.id === performerID.toString() ? playerA : playerB;
    const currentImageID = player.imageID;
    return props.changeImageHandler(+player.id, +(currentImageID ?? 0));
  };

  /** Handler for clicking the pause button. */
  const clickPauseHandler = () => {
    // TODO - For now, just navigate home. This will trigger saving data to the
    // Stash config when continuing tournaments is properly supported.
    navigate(PATH.HOME);
  };

  /** Handler for confirming abandonment of the current tournament. */
  const handleAbandonTournament = () => setShowAbandonModal(true);

  /** Handler for cancelling abandonment of the current tournament. */
  const handleCancelAbandonTournament = () => setShowAbandonModal(false);

  /** Handler for clicking the stop button. */
  const handleConfirmAbandonTournament = () => {
    // Navigate home
    navigate(PATH.HOME);

    // Clear all tournament data
    props.wipeTournamentHandler();
  };

  /** Handler for selecting a winner in a match */
  const handleSelectWinner = (winner: 0 | 1) => {
    props.selectWinnerHandler(winner);

    // Check if this is the final match, and activate the conclude tournament
    // modal if it is.
    if (props.matchIndex + 1 === props.matchList.length)
      setShowConcludeModal(true);
  };

  /** Handler for declaring a match a draw. */
  const handleSkipMatch = () => {
    props.declareDrawHandler();

    // Check if this is the final match, and activate the conclude tournament
    // modal if it is.
    if (props.matchIndex + 1 === props.matchList.length)
      setShowConcludeModal(true);
  };

  const classes = cx("container", styles.Tournament);

  console.log(props.matchList);

  return (
    <>
      <main className={classes}>
        <h2>
          Round {props.matchIndex + 1} / {props.matchList.length}
        </h2>
        <MatchBoard
          changeImageHandler={changeImageHandler}
          clickPauseHandler={clickPauseHandler}
          clickSelectHandler={handleSelectWinner}
          clickSkipHandler={handleSkipMatch}
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
      <AbandonMatchModal
        closeHandler={handleCancelAbandonTournament}
        continueHandler={handleConfirmAbandonTournament}
        show={showAbandonModal}
      />
      <ConcludeTournamentModal
        closeHandler={() => setShowConcludeModal(false)}
        continueHandler={props.processResultsHandler}
        show={showConcludeModal}
      />
    </>
  );
};

export default TournamentPage;

/* ---------------------------------------------------------------------------------------------- */
/*                                       Abandon match modal                                      */
/* ---------------------------------------------------------------------------------------------- */

interface AbandonMatchModalProps {
  /** Handler for cancelling abandonment of the current tournament. */
  closeHandler: () => void;
  /** Handler for confirming abandonment of the current tournament. */
  continueHandler: () => void;
  /** Dictates whether the modal is active. */
  show: boolean;
}

const AbandonMatchModal: React.FC<AbandonMatchModalProps> = (props) => {
  return (
    <Modal
      buttons={[
        {
          element: "button",
          children: "No",
          className: "btn btn-secondary",
          onClick: props.closeHandler,
          type: "button",
        },
        {
          element: "button",
          className: "btn btn-danger",
          children: "Yes",
          type: "button",
          onClick: props.continueHandler,
        },
      ]}
      icon={faHand}
      show={props.show}
      title="Abandon tournament?"
    >
      <p>
        If you abandon the tournament, all progress will be lost. This cannot be
        undone.
      </p>
      <p>Are you sure you want to abandon the tournament?</p>
    </Modal>
  );
};

/* ---------------------------------------------------------------------------------------------- */
/*                                    Conclude tournament modal                                   */
/* ---------------------------------------------------------------------------------------------- */

interface ConcludeTournamentModalProps {
  /** Handler for cancelling concluding the current tournament. */
  closeHandler: () => void;
  /** Handler for confirming concluding the current tournament. */
  continueHandler: () => void;
  /** Dictates whether the modal is active. */
  show: boolean;
}

const ConcludeTournamentModal: React.FC<ConcludeTournamentModalProps> = (
  props
) => {
  return (
    <Modal
      buttons={[
        {
          element: "button",
          children: "No",
          className: "btn btn-secondary",
          onClick: props.closeHandler,
          type: "button",
        },
        {
          element: "button",
          className: "btn btn-primary",
          children: "Yes",
          type: "button",
          onClick: props.continueHandler,
        },
      ]}
      icon={faPartyHorn}
      show={props.show}
      title="Tournament concluded"
    >
      <p>You have reached the end of the tournament!</p>

      <p>
        The results need to be processed before they can be viewed - this may
        take some time depending on how many performers are in your database.
      </p>
      <p>Would you like to continue to process the results?</p>
    </Modal>
  );
};
