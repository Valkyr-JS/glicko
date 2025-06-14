import React, { useEffect, useRef, useState } from "react";
import type { OperationVariables, QueryResult } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faForwardStep } from "@fortawesome/pro-solid-svg-icons/faForwardStep";
import { faImage } from "@fortawesome/pro-solid-svg-icons/faImage";
import { faImagePortrait } from "@fortawesome/pro-solid-svg-icons/faImagePortrait";
import { faRotateLeft } from "@fortawesome/pro-solid-svg-icons/faRotateLeft";
import { faSend } from "@fortawesome/pro-solid-svg-icons/faSend";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons/faSpinnerThird";
import { faStop } from "@fortawesome/pro-solid-svg-icons/faStop";
import { faTrophy } from "@fortawesome/pro-solid-svg-icons/faTrophy";
import { default as cx } from "classnames";
import type { StashFindImagesResult, StashPerformer } from "@/apollo/schema";
import styles from "./MatchBoard.module.scss";
import { DEFAULT_IMAGE_QUALITY } from "@/constants";

interface MatchBoardProps {
  /** Handler for clicking the change player image button. */
  changeImageHandler: (
    performerID: StashPerformer["id"]
  ) =>
    | Promise<QueryResult<StashFindImagesResult, OperationVariables>>
    | undefined;
  /** Executes when the user selects the winning player. */
  clickSelectHandler: (winner: 0 | 1) => Promise<void>;
  /** Handler for clicking the skip button. */
  clickSkipHandler: () => Promise<void>;
  /** Handler for clicking the stop button. */
  clickStopHandler: React.MouseEventHandler<HTMLButtonElement>;
  /** Handler for clicking the submit button. */
  clickSubmitHandler: React.MouseEventHandler<HTMLButtonElement>;
  /** Handler for clicking the undo button. */
  clickUndoHandler: () => Promise<void>;
  /** The quality of the performer images as set by the user. */
  imageQuality: UserSettings["imageQuality"];
  /** The zero-based index of the match in the current game session. */
  matchIndex: number;
  /** The players in the current match. */
  match: Match;
}

const MatchBoard: React.FC<MatchBoardProps> = (props) => {
  /** Whether a match is currently being loaded. */
  const [loading, setLoading] = useState(false);

  // When a new match has been loaded, mark loading as complete.
  useEffect(() => {
    setLoading(false);
  }, [props.match]);

  return (
    <section className={styles["one-vs-one-board"]}>
      <h2>Round {props.matchIndex + 1}</h2>
      <div className={styles["profiles"]}>
        <PlayerProfile
          {...props.match[0]}
          changeImageHandler={props.changeImageHandler}
          clickSelectHandler={props.clickSelectHandler}
          imageQuality={props.imageQuality}
          loading={loading}
          position={0}
          setLoading={setLoading}
        />
        <PlayerProfile
          {...props.match[1]}
          changeImageHandler={props.changeImageHandler}
          clickSelectHandler={props.clickSelectHandler}
          imageQuality={props.imageQuality}
          loading={loading}
          position={1}
          setLoading={setLoading}
        />
      </div>
      <div className={styles["tools"]}>
        <button
          className="btn btn-secondary"
          disabled={loading || props.matchIndex === 0}
          onClick={props.clickUndoHandler}
          type="button"
        >
          <span className="sr-only">Undo match</span>
          <FontAwesomeIcon icon={faRotateLeft} />
        </button>
        <button
          className="btn btn-danger"
          disabled={loading}
          onClick={props.clickStopHandler}
          type="button"
        >
          <span className="sr-only">Abandon progress</span>
          <FontAwesomeIcon icon={faStop} />
        </button>
        <button
          className="btn btn-secondary"
          disabled={loading}
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
          disabled={loading || props.matchIndex === 0}
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
  /** The quality of the performer images as set by the user. */
  imageQuality: UserSettings["imageQuality"];
  /** Whether a match is currently being loaded. */
  loading: boolean;
  /** Whether the profile is on the left, i.e. `0`, or right, i.e. `1` */
  position: 0 | 1;
  /** Updates the parent component loading state */
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const PlayerProfile = (props: PlayerProfileProps) => {
  const [imageSource, setImageSource] = useState(props.coverImg);
  const [imageLoading, setImageLoading] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);

  // When the performer changes, mark the cover image as loading.
  useEffect(() => {
    setCoverLoading(true);
  }, [props.id]);

  /** Handler for changing the image for the performer */
  const handleImageChange = async () => {
    setImageLoading(true);
    await props.changeImageHandler(+props.id);
  };

  /** Handler for resetting the performer's image back to their cover image. */
  const handleCoverReset = () => {
    setImageSource(props.coverImg);
  };

  const imageRef = useRef<HTMLImageElement>(null);

  // Wait until the image is finished loading
  useEffect(() => {
    if (imageRef.current?.complete) setImageLoading(false);
  }, [imageRef.current?.complete]);

  const baseUrl =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_STASH_SERVER
      : "";

  // When image change is detected, update the state
  useEffect(() => {
    const imgQuality =
      props.imageQuality === "original" ? "image" : DEFAULT_IMAGE_QUALITY;
    if (props.imageID)
      setImageSource(baseUrl + "/image/" + props.imageID + "/" + imgQuality);
    else setImageSource(props.coverImg);
  }, [baseUrl, props.coverImg, props.imageID, props.imageQuality]);

  const imageButtonDisabled = imageLoading || !props.imagesAvailable;
  const coverButtonDisabled =
    imageSource === props.coverImg || !props.imagesAvailable;

  const handleClickSelect = () => {
    props.setLoading(true);
    props.clickSelectHandler(props.position);
  };

  /** Handle callback when an image has been loaded. */
  const handleImageLoaded: React.ReactEventHandler<HTMLImageElement> = () => {
    setImageLoading(false);
    setCoverLoading(false);
  };

  const profileImageClasses = cx(styles["profile-image"], {
    [styles.loading]: coverLoading,
  });

  return (
    <div className={styles["profile"]}>
      <div className={profileImageClasses}>
        <img
          src={imageSource}
          alt={props.name}
          onLoad={handleImageLoaded}
          ref={imageRef}
        />
      </div>
      <span className={styles["rating"]}>
        <FontAwesomeIcon icon={faTrophy} />{" "}
        <span className="sr-only">{props.name}'s rating: </span>
        {Math.round(props.initialRating)}
      </span>
      <div className={styles["rating-button"]}>
        <button
          type="button"
          className="btn btn-primary"
          disabled={props.loading}
          onClick={handleClickSelect}
        >
          {props.loading ? (
            <FontAwesomeIcon icon={faSpinnerThird} spin className="mr-2" />
          ) : null}
          {props.name}
        </button>
      </div>
      <div className={styles["image-buttons"]}>
        <button
          className="btn btn-secondary"
          disabled={coverButtonDisabled}
          onClick={handleCoverReset}
          type="button"
        >
          <span className="sr-only">Reset to {props.name}'s cover image</span>
          <FontAwesomeIcon icon={faImagePortrait} />
        </button>
        <button
          className="btn btn-secondary"
          disabled={imageButtonDisabled || props.loading}
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
    </div>
  );
};
