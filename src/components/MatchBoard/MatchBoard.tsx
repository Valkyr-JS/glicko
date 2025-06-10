import React, { useState } from "react";
import type { OperationVariables, QueryResult } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faForwardStep } from "@fortawesome/pro-solid-svg-icons/faForwardStep";
import { faImage } from "@fortawesome/pro-solid-svg-icons/faImage";
import { faRotateLeft } from "@fortawesome/pro-solid-svg-icons/faRotateLeft";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons/faSpinnerThird";
import { faStop } from "@fortawesome/pro-solid-svg-icons/faStop";
import { faTrophy } from "@fortawesome/pro-solid-svg-icons/faTrophy";
import type { StashFindImagesResult, StashPerformer } from "@/apollo/schema";
import styles from "./MatchBoard.module.scss";
import { faSend } from "@fortawesome/pro-solid-svg-icons";

interface MatchBoardProps {
  /** Handler for clicking the change player image button. */
  changeImageHandler: (
    performerID: StashPerformer["id"]
  ) =>
    | Promise<QueryResult<StashFindImagesResult, OperationVariables>>
    | undefined;
  /** Executes when the user selects the winning player. */
  clickSelectHandler: (winner: 0 | 1) => void;
  /** Handler for clicking the skip button. */
  clickSkipHandler: React.MouseEventHandler<HTMLButtonElement>;
  /** Handler for clicking the stop button. */
  clickStopHandler: React.MouseEventHandler<HTMLButtonElement>;
  /** Handler for clicking the submit button. */
  clickSubmitHandler: React.MouseEventHandler<HTMLButtonElement>;
  /** Handler for clicking the undo button. */
  clickUndoHandler: React.MouseEventHandler<HTMLButtonElement>;
  /** The zero-based index of the match in the current game session. */
  matchIndex: number;
  /** The players in the current match. */
  match: Match | null;
}

const MatchBoard: React.FC<MatchBoardProps> = (props) => {
  if (!props.match) return null;

  return (
    <section className={styles["one-vs-one-board"]}>
      <h2>Round {props.matchIndex + 1}</h2>
      <div className={styles["profiles"]}>
        <PlayerProfile
          {...props.match[0]}
          changeImageHandler={props.changeImageHandler}
          clickSelectHandler={props.clickSelectHandler}
          position={0}
        />
        <PlayerProfile
          {...props.match[1]}
          changeImageHandler={props.changeImageHandler}
          clickSelectHandler={props.clickSelectHandler}
          position={1}
        />
      </div>
      <div className={styles["tools"]}>
        <button
          className="btn btn-secondary"
          disabled={props.matchIndex === 0}
          onClick={props.clickUndoHandler}
          type="button"
        >
          <span className="sr-only">Undo match</span>
          <FontAwesomeIcon icon={faRotateLeft} />
        </button>
        <button
          className="btn btn-danger"
          onClick={props.clickStopHandler}
          type="button"
        >
          <span className="sr-only">Abandon progress</span>
          <FontAwesomeIcon icon={faStop} />
        </button>
        <button
          className="btn btn-secondary"
          onClick={props.clickSkipHandler}
          type="button"
        >
          <span className="sr-only">Skip match</span>
          <FontAwesomeIcon icon={faForwardStep} />
        </button>
      </div>
      <div className={styles["submit"]}>
        <button
          className="btn btn-primary"
          disabled={props.matchIndex === 0}
          onClick={props.clickSubmitHandler}
          type="button"
        >
          <FontAwesomeIcon icon={faSend} className="mr-2" />
          <span>Submit</span>
        </button>
      </div>
    </section>
  );
};

export default MatchBoard;

interface PlayerProfileProps extends MatchPerformer {
  /** Executes when the user clicks to change the current player's image. */
  changeImageHandler: (
    performerID: StashPerformer["id"]
  ) =>
    | Promise<QueryResult<StashFindImagesResult, OperationVariables>>
    | undefined;
  /** Executes when the user selects the winning player. */
  clickSelectHandler: (winner: 0 | 1) => void;
  /** Whether the profile is on the left, i.e. `0`, or right, i.e. `1` */
  position: 0 | 1;
}

const PlayerProfile = (props: PlayerProfileProps) => {
  const [imageLoading, setImageLoading] = useState(false);
  const handleImageChange = async () => {
    setImageLoading(true);
    await props.changeImageHandler(+props.id);
    setImageLoading(false);
  };

  const baseUrl =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_STASH_SERVER
      : "";
  const imageSource = props.imageID
    ? baseUrl + "/image/" + props.imageID + "/thumbnail"
    : props.coverImg;

  const imageButtonDisabled = imageLoading || !props.imagesAvailable;

  return (
    <div className={styles["profile"]}>
      <div className={styles["profile-image"]}>
        <img
          src={imageSource}
          alt={props.name}
          onLoad={() => setImageLoading(false)}
        />
      </div>
      <span className={styles["rating"]}>
        <FontAwesomeIcon icon={faTrophy} />{" "}
        <span className="sr-only">{props.name}'s rating: </span>
        {Math.round(props.initialRating)}
      </span>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => props.clickSelectHandler(props.position)}
      >
        {props.name}
      </button>
      <button
        className="btn btn-secondary"
        disabled={imageButtonDisabled}
        onClick={handleImageChange}
        type="button"
      >
        <span className="sr-only">
          {imageButtonDisabled
            ? `No alternative images available for ${props.name}`
            : `Change image for ${props.name}`}
        </span>
        {imageLoading ? (
          <FontAwesomeIcon icon={faSpinnerThird} spin />
        ) : (
          <FontAwesomeIcon icon={faImage} />
        )}
      </button>
    </div>
  );
};
