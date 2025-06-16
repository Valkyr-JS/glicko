import React, { useEffect, useState } from "react";
import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
import { faChessRook } from "@fortawesome/pro-solid-svg-icons/faChessRook";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons/faSpinnerThird";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { default as cx } from "classnames";
import type { StashVersionResult } from "@/apollo/schema";
import type { OperationVariables, QueryResult } from "@apollo/client";
import { GameErrorModal } from "@/components/Modal/Modal";
import StashVersionReport from "@/components/StashVersionReport/StashVersionReport";
import styles from "./Home.module.scss";
import { getStashVersionBreakdown } from "@/helpers/stash";

type StashVersionFetchRequest = QueryResult<
  StashVersionResult,
  OperationVariables
>;

interface HomePageProps extends PageProps {
  /** Handler for clearing any game error data. */
  clearGameError: () => void;
  /** Any kind of game error that stop the user from playing. */
  gameError: GameError | null;
  /** Dictates whether the game is currently loading in preparation for play. */
  gameLoading: boolean;
  /** Handler for starting a new game of the set game mode. */
  startGameHandler: () => void;
  /** The data returned by a successful Stash version fetch request. */
  versionData: StashVersionResult | null;
  /** The Apollo error returned by the Stash version fetch request. */
  versionError: StashVersionFetchRequest["error"];
  /** The Apollo error returned by the Stash version fetch request. */
  versionLoading: boolean;
}

const HomePage: React.FC<HomePageProps> = (props) => {
  const [showGameErrorModal, setShowGameErrorModal] = useState(false);

  const classes = cx("container", styles.Home);

  useEffect(() => {
    if (props.gameError) setShowGameErrorModal(true);
  }, [props.gameError]);

  /* ---------------------------------------- Start button ---------------------------------------- */

  const startButtonDisabled =
    !!props.gameError ||
    props.gameLoading ||
    props.versionLoading ||
    !!props.versionError;

  const startButton = (
    <button
      type="button"
      className="btn btn-primary"
      disabled={startButtonDisabled}
      onClick={props.startGameHandler}
    >
      {props.gameLoading ? (
        <>
          <FontAwesomeIcon className="mr-2" icon={faSpinnerThird} spin />
          Loading...
        </>
      ) : (
        "Start"
      )}
    </button>
  );

  /* ----------------------------------------- Leaderboard ---------------------------------------- */

  /** Handle clicking the leaderboard button */
  const handleOpenLeaderboard: React.MouseEventHandler<
    HTMLButtonElement
  > = () => props.setActivePage("LEADERBOARD");

  // Disable the button if Stash is below v0.28.0
  const leaderboardButton = (
    <button
      type="button"
      className="btn btn-secondary"
      disabled={
        props.versionLoading ||
        !!props.versionError ||
        (!!props.versionData?.version?.version &&
          getStashVersionBreakdown(props.versionData.version.version)[1] < 28)
      }
      onClick={handleOpenLeaderboard}
    >
      Leaderboard
    </button>
  );

  /* -------------------------------------- Performer filters ------------------------------------- */

  /** Handle clicking the performer filters button */
  const handleOpenPerformerFilters: React.MouseEventHandler<
    HTMLButtonElement
  > = () => props.setActivePage("FILTERS");

  const filtersButton = (
    <button
      type="button"
      className="btn btn-secondary"
      disabled={props.versionLoading || !!props.versionError}
      onClick={handleOpenPerformerFilters}
    >
      Performer filters
    </button>
  );

  /* ---------------------------------------- User settings --------------------------------------- */

  /** Handle clicking the change settings button */
  const handleOpenUserSettings: React.MouseEventHandler<
    HTMLButtonElement
  > = () => props.setActivePage("SETTINGS");

  const settingsButton = (
    <button
      type="button"
      className="btn btn-secondary"
      disabled={props.versionLoading || !!props.versionError}
      onClick={handleOpenUserSettings}
    >
      Settings
    </button>
  );

  /* --------------------------------------- Error handling --------------------------------------- */

  const handleCloseErrorModal = () => {
    props.clearGameError();
    setShowGameErrorModal(false);
  };

  /* ------------------------------------------ Component ----------------------------------------- */

  return (
    <>
      <main className={classes}>
        <header>
          <FontAwesomeIcon icon={faChessRook} />
          <h1>Glicko</h1>
        </header>
        <nav>
          <ul>
            <li>{startButton}</li>
            <li>{leaderboardButton}</li>
            <li>{filtersButton}</li>
            <li>{settingsButton}</li>
          </ul>
        </nav>
        <div className={styles.report}>
          <StashVersionReport
            request={{
              data: props.versionData ?? undefined,
              error: props.versionError,
              loading: props.versionLoading,
            }}
          />
        </div>
        <footer>
          <a href="https://github.com/Valkyr-JS/glicko">
            <FontAwesomeIcon icon={faGithub} />
            <span className="sr-only">Visit the Github repository</span>
          </a>
          <span>Version {__APP_VERSION__}</span>
        </footer>
      </main>
      <GameErrorModal
        closeHandler={handleCloseErrorModal}
        gameError={props.gameError}
        show={showGameErrorModal}
      />
    </>
  );
};

export default HomePage;
