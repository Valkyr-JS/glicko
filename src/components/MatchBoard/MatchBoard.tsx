import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faForwardStep } from "@fortawesome/pro-solid-svg-icons/faForwardStep";
import { faPause } from "@fortawesome/pro-solid-svg-icons/faPause";
import { faRotateLeft } from "@fortawesome/pro-solid-svg-icons/faRotateLeft";
import { faStop } from "@fortawesome/pro-solid-svg-icons/faStop";
import styles from "./MatchBoard.module.scss";

interface OneVsOneBoardProps {
  /** Executes when the user clicks to change the current performer image. */
  changeImageHandler: (performerID: string, prevID: number) => void;
  /** Executes when the user click the pause button. */
  clickPauseHandler: React.MouseEventHandler<HTMLButtonElement>;
  /** Executes when the user selects the winning performer. */
  clickSelectHandler: (winner: 0 | 1) => void;
  /** Executes when the user click the skip button. */
  clickSkipHandler: React.MouseEventHandler<HTMLButtonElement>;
  /** Executes when the user click the stop button. */
  clickStopHandler: React.MouseEventHandler<HTMLButtonElement>;
  /** Executes when the user click the undo button. */
  clickUndoHandler: React.MouseEventHandler<HTMLButtonElement>;
  /** The zero-based index of the current match. */
  matchIndex: number;
}

const OneVsOneBoard: React.FC<OneVsOneBoardProps> = (props) => {
  return (
    <section className={styles["one-vs-one-board"]}>
      <div className={styles["profiles"]}>
        <div>Profile 1</div>
        <div>Profile 2</div>
      </div>
      <div className={styles["tools"]}>
        <button
          className="btn btn-secondary"
          disabled={props.matchIndex === 0}
          onClick={props.clickUndoHandler}
        >
          <span className="sr-only">Undo</span>
          <FontAwesomeIcon icon={faRotateLeft} />
        </button>
        <button className="btn btn-danger" onClick={props.clickStopHandler}>
          <span className="sr-only">End tournament</span>
          <FontAwesomeIcon icon={faStop} />
        </button>
        <button className="btn btn-secondary" onClick={props.clickPauseHandler}>
          <span className="sr-only">Pause tournament</span>
          <FontAwesomeIcon icon={faPause} />
        </button>
        <button className="btn btn-secondary" onClick={props.clickSkipHandler}>
          <span className="sr-only">Skip</span>
          <FontAwesomeIcon icon={faForwardStep} />
        </button>
      </div>
    </section>
  );
};

export default OneVsOneBoard;
