import React, { useState } from "react";
import { default as cx } from "classnames";
import type { OperationVariables, QueryResult } from "@apollo/client";
import { faHand } from "@fortawesome/pro-solid-svg-icons/faHand";
import type {
  StashFindImages,
  StashImage,
  StashPerformer,
} from "@/apollo/schema";
import MatchBoard from "@/components/MatchBoard/MatchBoard";
import Modal from "@/components/Modal/Modal";
import styles from "./Tournament.module.scss";

interface GamePageProps extends PageProps {
  /** Handler for setting a new performer image */
  changeImageHandler: (
    performerID: StashPerformer["id"],
    currentImageID: StashImage["id"]
  ) => Promise<QueryResult<StashFindImages, OperationVariables>>;
  /** The data for all players involved in the tournament. */
  match: [MatchPerformer, MatchPerformer];
  /** The list of match results, including scores. */
  results: GlickoMatchResult[];
  /** The zero-based index of the current match in the match list. */
  matchIndex: number;
  /** Handler for declaring a match a draw. */
  setDrawHandler: () => void;
  /** Handler for selecting the winner of a match. */
  setWinnerHandler: (winner: 0 | 1) => void;
  /** Handle for submitting the match results. */
  submitHandler: () => void;
  /** Handler for reloading the previous match. */
  undoMatchHandler: () => void;
  /** Handler for clearing all tournament data. */
  wipeResultsHandler: () => void;
}

const GamePage: React.FC<GamePageProps> = (props) => {
  const [showAbandonModal, setShowAbandonModal] = useState(false);

  if (props.match.length !== 2) return null;

  const playerA = props.match[0];
  const playerB = props.match[1];

  /** Handler for clicking the change player image button. */
  const changeImageHandler = (performerID: StashPerformer["id"]) => {
    const player = playerA.id === performerID ? playerA : playerB;
    const currentImageID = player.imageID;
    return props.changeImageHandler(+player.id, +(currentImageID ?? 0));
  };

  /** Handler for confirming abandonment of the current tournament. */
  const handleAbandonTournament = () => setShowAbandonModal(true);

  /** Handler for cancelling abandonment of the current tournament. */
  const handleCancelAbandonTournament = () => setShowAbandonModal(false);

  /** Handler for clicking the stop button. */
  const handleConfirmAbandonTournament = () => {
    // Navigate home
    props.setActivePage("HOME");

    // Clear all tournament data
    props.wipeResultsHandler();
  };

  const classes = cx("container", styles.Tournament);

  return (
    <>
      <main className={classes}>
        <MatchBoard
          changeImageHandler={changeImageHandler}
          clickSelectHandler={props.setWinnerHandler}
          clickSkipHandler={props.setDrawHandler}
          clickStopHandler={handleAbandonTournament}
          clickSubmitHandler={() => console.log("submit")}
          clickUndoHandler={props.undoMatchHandler}
          matchIndex={props.matchIndex}
          match={props.match}
        />
      </main>
      <AbandonMatchModal
        closeHandler={handleCancelAbandonTournament}
        continueHandler={handleConfirmAbandonTournament}
        show={showAbandonModal}
      />
    </>
  );
};

export default GamePage;

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
