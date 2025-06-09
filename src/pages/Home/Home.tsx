import React, { useEffect, useState } from "react";
import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
import { faChessRook } from "@fortawesome/pro-solid-svg-icons/faChessRook";
import { faHand } from "@fortawesome/pro-solid-svg-icons/faHand";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons/faSpinnerThird";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { default as cx } from "classnames";
import Modal from "@/components/Modal/Modal";
import StashVersionReport from "@/components/StashVersionReport/StashVersionReport";
import styles from "./Home.module.scss";
import type { StashVersion } from "@/apollo/schema";

interface HomePageProps extends PageProps {
  /** Any kind of game error that stop the user from playing. */
  gameError: GameError | null;
  /** Dictates whether the game is currently loading in preparation for play. */
  gameLoading: boolean;
  /** Handler for starting a new game of the set game mode. */
  startGameHandler: () => void;
  /** The data returned by a successful Stash version fetch request. */
  versionData: StashVersion;
  /** The Apollo error returned by the Stash version fetch request. */
  versionError: versionFetchRequest["error"];
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

  /* -------------------------------------- Performer filters ------------------------------------- */

  /** Handle clicking the change settings button */
  const handleChangeSettings: React.MouseEventHandler<HTMLButtonElement> = () =>
    props.setActivePage("FILTERS");

  const filtersButton = (
    <button
      type="button"
      className="btn btn-secondary"
      disabled={props.versionLoading || !!props.versionError}
      onClick={handleChangeSettings}
    >
      Performer filters
    </button>
  );

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
            <li>{filtersButton}</li>
            <li>
              <button type="button" className="btn btn-secondary" disabled>
                Leaderboard
              </button>
            </li>
          </ul>
        </nav>
        <div className={styles.report}>
          <StashVersionReport
            request={{
              data: props.versionData,
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
      <Modal
        buttons={[
          {
            element: "anchor",
            children: "Open issue on GitHub",
            className: "btn btn-secondary",
            target: "_blank",
            href:
              "https://github.com/Valkyr-JS/glicko/issues/new?title=[ Game%20error ]&labels=bug&body=**Please add any other relevant details before submitting.**%0D%0A%0D%0A%0D%0A%0D%0A---%0D%0A%0D%0AVersion " +
              __APP_VERSION__ +
              "%0D%0A%0D%0A```%0D%0A" +
              encodeURI(
                JSON.stringify(props.gameError?.details) ?? "No error"
              ) +
              "%0D%0A```",
          },
          {
            element: "button",
            children: "Close",
            className: "btn btn-primary",
            onClick: () => setShowGameErrorModal(false),
            type: "button",
          },
        ]}
        icon={faHand}
        show={showGameErrorModal}
        title={props.gameError?.name ?? "No error name"}
      >
        <p>An error occured whilst attempting to fetch data from Stash.</p>
        <p>
          <code>{props.gameError?.message ?? "No error message"}</code>
        </p>
        <p>
          Please check your settings and retry. If you continue to run into this
          error, please raise an issue on GitHub using the button below.
        </p>
        <code>{JSON.stringify(props.gameError?.details) ?? "No error"}</code>
      </Modal>
    </>
  );
};

export default HomePage;
