import React, { useState } from "react";
import type { OperationVariables, QueryResult } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faForwardStep } from "@fortawesome/pro-solid-svg-icons/faForwardStep";
import { faImage } from "@fortawesome/pro-solid-svg-icons/faImage";
import { faPause } from "@fortawesome/pro-solid-svg-icons/faPause";
import { faRotateLeft } from "@fortawesome/pro-solid-svg-icons/faRotateLeft";
import { faStop } from "@fortawesome/pro-solid-svg-icons/faStop";
import { faTrophy } from "@fortawesome/pro-solid-svg-icons/faTrophy";
import type { StashFindImages, StashPerformer } from "@/apollo/schema";
import type { PlayerData } from "@/types/global";
import styles from "./MatchBoard.module.scss";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";

interface OneVsOneBoardProps {
  /** Handler for clicking the change player image button. */
  changeImageHandler: (
    performerID: StashPerformer["id"]
  ) => Promise<QueryResult<StashFindImages, OperationVariables>>;
  /** Handler for clicking the pause button. */
  clickPauseHandler: React.MouseEventHandler<HTMLButtonElement>;
  /** Executes when the user selects the winning player. */
  clickSelectHandler: (winner: 0 | 1) => void;
  /** Handler for clicking the skip button. */
  clickSkipHandler: React.MouseEventHandler<HTMLButtonElement>;
  /** Handler for clicking the stop button. */
  clickStopHandler: React.MouseEventHandler<HTMLButtonElement>;
  /** Handler for clicking the undo button. */
  clickUndoHandler: React.MouseEventHandler<HTMLButtonElement>;
  /** The zero-based index of the current match in the match list. */
  matchIndex: number;
  /** The players in the current match. */
  players: [PlayerData, PlayerData];
}

const OneVsOneBoard: React.FC<OneVsOneBoardProps> = (props) => {
  return (
    <section className={styles["one-vs-one-board"]}>
      <div className={styles["profiles"]}>
        <PlayerProfile
          {...props.players[0]}
          changeImageHandler={props.changeImageHandler}
          clickSelectHandler={props.clickSelectHandler}
          position={0}
        />
        <PlayerProfile
          {...props.players[1]}
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
        >
          <span className="sr-only">Undo match</span>
          <FontAwesomeIcon icon={faRotateLeft} />
        </button>
        <button className="btn btn-danger" onClick={props.clickStopHandler}>
          <span className="sr-only">Abandon tournament</span>
          <FontAwesomeIcon icon={faStop} />
        </button>
        <button className="btn btn-secondary" onClick={props.clickPauseHandler}>
          <span className="sr-only">Pause tournament</span>
          <FontAwesomeIcon icon={faPause} />
        </button>
        <button className="btn btn-secondary" onClick={props.clickSkipHandler}>
          <span className="sr-only">Skip match</span>
          <FontAwesomeIcon icon={faForwardStep} />
        </button>
      </div>
    </section>
  );
};

export default OneVsOneBoard;

interface PlayerProfileProps extends PlayerData {
  /** Executes when the user clicks to change the current player's image. */
  changeImageHandler: (
    performerID: StashPerformer["id"]
  ) => Promise<QueryResult<StashFindImages, OperationVariables>>;
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
  };

  const baseUrl =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_STASH_SERVER
      : "";
  const imageSource = props.imageID
    ? baseUrl + "/image/" + props.imageID + "/thumbnail"
    : props.coverImg;

  return (
    <div className={styles["profile"]}>
      <span className={styles["rating"]}>
        <FontAwesomeIcon icon={faTrophy} />{" "}
        <span className="sr-only">{props.name}'s rating: </span>
        {props.glicko.getRating()}
      </span>
      <div className={styles["profile-image"]}>
        <img
          src={imageSource}
          alt={props.name}
          onLoad={() => setImageLoading(false)}
        />
      </div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => props.clickSelectHandler(props.position)}
      >
        {props.name}
      </button>
      <button
        className="btn btn-secondary"
        disabled={imageLoading || !props.imagesAvailable}
        onClick={handleImageChange}
        type="button"
      >
        <span className="sr-only">Change image for {props.name}</span>
        {imageLoading ? (
          <FontAwesomeIcon icon={faSpinnerThird} spin />
        ) : (
          <FontAwesomeIcon icon={faImage} />
        )}
      </button>
    </div>
  );
};
