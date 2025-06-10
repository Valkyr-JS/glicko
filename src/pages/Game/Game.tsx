import React, { useEffect, useState } from "react";
import { default as cx } from "classnames";
import type { OperationVariables, QueryResult } from "@apollo/client";
import { faExclamationCircle } from "@fortawesome/pro-solid-svg-icons/faExclamationCircle";
import { faSend } from "@fortawesome/pro-solid-svg-icons/faSend";
import type {
  StashFindImagesResult,
  StashImage,
  StashPerformer,
} from "@/apollo/schema";
import MatchBoard from "@/components/MatchBoard/MatchBoard";
import Modal, { GameErrorModal } from "@/components/Modal/Modal";
import { RECOMMENDED_MINIMUM_MATCHES } from "@/constants";
import styles from "./Game.module.scss";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface GamePageProps extends PageProps {
  /** Handler for setting a new performer image */
  changeImageHandler: (
    performerID: StashPerformer["id"],
    currentImageID: StashImage["id"]
  ) => Promise<QueryResult<StashFindImagesResult, OperationVariables>>;
  /** Any kind of game error that stop the user from playing. */
  gameError: GameError | null;
  /** The data for the players involved in the match. */
  match: Match | null;
  /** The zero-based index of the current match in the match list. */
  matchIndex: number;
  /** Dictates whether the results of the session are currently being processed. */
  processingResults: boolean;
  /** The list of match results, including scores. */
  results: GlickoMatchResult[];
  /** Handler for declaring a match a draw. */
  setDrawHandler: () => void;
  /** Handler for selecting the winner of a match. */
  setWinnerHandler: (winnerIndex: 0 | 1) => void;
  /** Handle for submitting the match results. */
  submitHandler: () => void;
  /** Handler for reloading the previous match. */
  undoMatchHandler: () => void;
  /** Handler for clearing all session data. */
  wipeResultsHandler: () => void;
}

const GamePage: React.FC<GamePageProps> = (props) => {
  const [showAbandonModal, setShowAbandonModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    if (props.gameError) setShowErrorModal(true);
  }, [props.gameError]);

  const classes = cx("container", styles.Game);

  /* ------------------------------------------ Handlers ------------------------------------------ */

  /** Handler for clicking the change player image button. */
  const changeImageHandler = (performerID: StashPerformer["id"]) => {
    if (!props.match) return undefined;

    const playerA = props.match[0];
    const playerB = props.match[1];
    const player = +playerA.id === performerID ? playerA : playerB;
    const currentImageID = player.imageID;
    return props.changeImageHandler(+player.id, +(currentImageID ?? 0));
  };

  /** Handler for confirming abandonment of the current session. */
  const handleAbandonProgress = () => setShowAbandonModal(true);

  /** Handler for cancelling abandonment of the current session. */
  const handleCancelAbandonProgress = () => setShowAbandonModal(false);

  /** Handler for clicking the stop button. */
  const handleConfirmAbandonProgress = () => {
    // Navigate home
    props.setActivePage("HOME");

    // Clear all session data
    props.wipeResultsHandler();
  };

  /** Handler for clicking the Submit button */
  const handleSubmitClick: React.MouseEventHandler = () =>
    setShowSubmitModal(true);

  /** Handler for clicking the Cancel button in the submission modal */
  const handleCancelSubmit: React.MouseEventHandler = () =>
    setShowSubmitModal(false);

  /** Handler for closing the game error modal. */
  const handleErrorClose = () => setShowErrorModal(false);

  /* ------------------------------------------ Component ----------------------------------------- */

  return (
    <>
      <main className={classes}>
        <MatchBoard
          changeImageHandler={changeImageHandler}
          clickSelectHandler={props.setWinnerHandler}
          clickSkipHandler={props.setDrawHandler}
          clickStopHandler={handleAbandonProgress}
          clickSubmitHandler={handleSubmitClick}
          clickUndoHandler={props.undoMatchHandler}
          matchIndex={props.matchIndex}
          match={props.match}
        />
      </main>
      <GameErrorModal
        closeHandler={handleErrorClose}
        gameError={props.gameError}
        show={showErrorModal}
      />
      <AbandonMatchModal
        closeHandler={handleCancelAbandonProgress}
        continueHandler={handleConfirmAbandonProgress}
        show={showAbandonModal}
      />
      <SubmitProgressModal
        closeHandler={handleCancelSubmit}
        continueHandler={props.submitHandler}
        matchIndex={props.matchIndex}
        processingResults={props.processingResults}
        show={showSubmitModal}
      />
    </>
  );
};

export default GamePage;

/* ---------------------------------------------------------------------------------------------- */
/*                                       Abandon match modal                                      */
/* ---------------------------------------------------------------------------------------------- */

interface AbandonMatchModalProps {
  /** Handler for cancelling abandonment of the current session. */
  closeHandler: React.MouseEventHandler;
  /** Handler for confirming abandonment of the current session. */
  continueHandler: React.MouseEventHandler;
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
      icon={faExclamationCircle}
      show={props.show}
      title="Abandon session?"
    >
      <p>
        If you abandon the session, all progress will be lost. This cannot be
        undone.
      </p>
      <p>Are you sure you want to abandon the session?</p>
    </Modal>
  );
};

/* ---------------------------------------------------------------------------------------------- */
/*                                      Submit progress modal                                     */
/* ---------------------------------------------------------------------------------------------- */

interface SubmitProgressModalProps {
  /** Handler for cancelling abandonment of the current session. */
  closeHandler: React.MouseEventHandler;
  /** Handler for confirming abandonment of the current session. */
  continueHandler: React.MouseEventHandler;
  /** The zero-based index of the current match in the match list. */
  matchIndex: number;
  /** Dictates whether the results of the session are currently being processed. */
  processingResults: boolean;
  /** Dictates whether the modal is active. */
  show: boolean;
}

const SubmitProgressModal: React.FC<SubmitProgressModalProps> = (props) => {
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setIsProcessing(props.processingResults);
  }, [props.processingResults]);

  const isNotEnough = props.matchIndex < RECOMMENDED_MINIMUM_MATCHES - 1;

  const children = isNotEnough ? (
    <>
      <p>
        It is recommended to submit at least {RECOMMENDED_MINIMUM_MATCHES}{" "}
        matches per session, however you have only played {props.matchIndex + 1}{" "}
        so far.
      </p>
      <p>Are you sure your want to submit results?</p>
    </>
  ) : (
    <>
      <p>
        Your session will be submitted and new results will be processed. This
        may take some time depending on how many performers exist in your
        library.
      </p>
      <p>Are you sure your want to submit results?</p>
    </>
  );

  const icon = isNotEnough ? faExclamationCircle : faSend;
  const title = isNotEnough ? "Too few matches played" : "Submit results?";

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
          children: (
            <>
              {isProcessing ? (
                <FontAwesomeIcon icon={faSpinnerThird} spin className="mr-2" />
              ) : null}
              Yes
            </>
          ),
          type: "button",
          onClick: props.continueHandler,
        },
      ]}
      icon={icon}
      show={props.show}
      title={title}
      children={children}
    />
  );
};
