import React, { useEffect, useState } from "react";
import type { OperationVariables, QueryResult } from "@apollo/client";
import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
import { faChessRook } from "@fortawesome/pro-solid-svg-icons/faChessRook";
import { faHand } from "@fortawesome/pro-solid-svg-icons/faHand";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons/faSpinnerThird";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { default as cx } from "classnames";
import type {
  StashFindPerformersResultType,
  StashVersion,
} from "@/apollo/schema";
import Modal from "@/components/Modal/Modal";
import type { PageProps } from "../../../types/global";
import styles from "./Home.module.scss";
import StashVersionReport from "@/components/StashVersionReport/StashVersionReport";

type performerFetchRequest = QueryResult<
  StashFindPerformersResultType,
  OperationVariables
>;

type versionFetchRequest = QueryResult<StashVersion, OperationVariables>;

interface HomePageProps extends PageProps {
  /** The data returned by a successful performers fetch request. */
  fetchData: StashFindPerformersResultType | null;
  /** The Apollo error returned by the performers fetch request. */
  fetchError: performerFetchRequest["error"] | null;
  /** The Apollo error returned by the performers fetch request. */
  fetchLoading: boolean;
  /** Dictates whether a tournament is in progress. */
  inProgress: boolean;
  /** Handler for starting a new tournament. The resolved boolean dictates
   * whether a new tournament is ready to start. */
  startNewTournamentHandler: () => Promise<void>;
  /** The data returned by a successful version fetch request. */
  versionData: StashVersion;
  /** The Apollo error returned by the version fetch request. */
  versionError: versionFetchRequest["error"];
  /** The Apollo error returned by the version fetch request. */
  versionLoading: boolean;
}

const HomePage: React.FC<HomePageProps> = ({
  fetchData,
  fetchError,
  fetchLoading,
  setActivePage,
  ...props
}) => {
  const [showChangeSettingsModal, setShowChangeSettingsModal] = useState(false);
  const [showNewTournamentModal, setShowNewTournamentModal] = useState(false);
  const [showFetchErrorModal, setShowFetchErrorModal] = useState(false);
  const [showMinPerformersModal, setShowMinPerformersModal] = useState(false);
  const [attemptNavigate, setAttemptNavigate] = useState(false);

  const classes = cx("container", styles.Home);

  /* ---------------------------- New tournament button click handling ---------------------------- */

  // Handle what happens on clicking the new tournament button based on current
  // state. This is done this way as `props.startNewTournamentHandler` doesn't
  // return data, and while it could be made to, there were serious difficulties
  // in getting this to work with testing. Would be good to address this at a
  // later date.
  useEffect(() => {
    // Only run these checks when attempting to navigate to the tournament page
    if (attemptNavigate) {
      // If an error occurs when trying to fetch data, render a modal.
      if (fetchError) {
        setShowFetchErrorModal(true);
      }

      // If there are not enough performers found using the current settings,
      // render a modal.
      else if (fetchData && fetchData.findPerformers.count < 2) {
        setShowMinPerformersModal(true);
      }

      // If ready to move to the tournament, do so
      else if (!fetchLoading) {
        setActivePage("TOURNAMENT");
      }
    }
  }, [attemptNavigate, fetchError, fetchLoading, fetchData, setActivePage]);

  /* --------------------------------- Continue tournament button --------------------------------- */

  const continueTournamentLoading = fetchLoading && props.inProgress;

  /** Handle clicking the new tournament button. */
  const handleContinueTournament: React.MouseEventHandler<
    HTMLButtonElement
  > = () => setActivePage("TOURNAMENT");

  // Add the "Continue tournament" option if required
  const ContinueItem = () =>
    props.inProgress ? (
      <li>
        <button
          type="button"
          className="btn btn-primary"
          disabled={continueTournamentLoading}
          onClick={handleContinueTournament}
        >
          {continueTournamentLoading ? (
            <FontAwesomeIcon className="mr-2" icon={faSpinnerThird} spin />
          ) : null}
          Continue tournament
        </button>
      </li>
    ) : null;

  /* ------------------------------------ New tournament button ----------------------------------- */

  // The "New tournament" button should only be primary if there is not already
  // a tournament in progress.
  const newTournamentClasses = cx("btn", {
    "btn-primary": !props.inProgress,
    "btn-secondary": props.inProgress,
  });

  /** Handle clicking the new tournament button. */
  const handleNewTournament: React.MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    // If there is already a tournament in progress, display the modal. Else
    // continue.
    if (props.inProgress) setShowNewTournamentModal(true);
    else {
      await props.startNewTournamentHandler();
      setAttemptNavigate(true);
    }
  };

  /** Handle starting a new tournament when one is in progress. */
  const handleNewTournamentInProgress: React.MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    await props.startNewTournamentHandler();
    setAttemptNavigate(true);
  };

  const newTournamentLoading = fetchLoading && !props.inProgress;

  const newTournamentButton = (
    <button
      type="button"
      className={newTournamentClasses}
      disabled={newTournamentLoading}
      onClick={handleNewTournament}
    >
      {newTournamentLoading ? (
        <FontAwesomeIcon className="mr-2" icon={faSpinnerThird} spin />
      ) : null}
      New tournament
    </button>
  );

  /* --------------------------------- Tournament settings button --------------------------------- */

  /** Handle clicking the change settings button */
  const handleChangeSettings: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    // If there is already a tournament in progress, display the modal. Else
    // continue.
    if (props.inProgress) setShowChangeSettingsModal(true);
    else setActivePage("SETTINGS");
  };

  const tournamentSettingsButton = (
    <button
      type="button"
      className="btn btn-secondary"
      onClick={handleChangeSettings}
    >
      Tournament settings
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
            <ContinueItem />
            <li>{newTournamentButton}</li>
            <li>{tournamentSettingsButton}</li>
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
      <InProgressModal
        closeModalHandler={() => setShowNewTournamentModal(false)}
        continueHandler={handleNewTournamentInProgress}
        show={showNewTournamentModal}
      >
        <p>
          A tournament is already in progress. If you start a new tournament,
          your previous progress will be lost. This cannot be undone.
        </p>
        <p>Would you still like to start a new tournament?</p>
      </InProgressModal>
      <InProgressModal
        closeModalHandler={() => setShowChangeSettingsModal(false)}
        continueHandler={() => setActivePage("SETTINGS")}
        show={showChangeSettingsModal}
      >
        <p>
          A tournament is already in progress. If you change your tournament
          settings, your previous progress will be lost. This cannot be undone.
        </p>
        <p>Would you still like to update the settings?</p>
      </InProgressModal>
      <Modal
        buttons={[
          {
            element: "anchor",
            children: "Open issue on GitHub",
            className: "btn btn-secondary",
            target: "_blank",
            href:
              "https://github.com/Valkyr-JS/glicko/issues/new?title=[ Fetch%20error ]&labels=bug&body=**Please add any other relevant details before submitting.**%0D%0A%0D%0A%0D%0A%0D%0A---%0D%0A%0D%0AVersion " +
              __APP_VERSION__ +
              "%0D%0A%0D%0A```%0D%0A" +
              encodeURI(JSON.stringify(fetchError) ?? "No error") +
              "%0D%0A```",
          },
          {
            element: "button",
            children: "Close",
            className: "btn btn-primary",
            onClick: () => setShowFetchErrorModal(false),
            type: "button",
          },
        ]}
        icon={faHand}
        show={showFetchErrorModal}
        title={fetchError?.name ?? "No error name"}
      >
        <p>An error occured whilst attempting to fetch data from Stash.</p>
        <p>
          <code>{fetchError?.message ?? "No error message"}</code>
        </p>
        <p>
          Please check your settings and retry. If you continue to run into this
          error, please raise an issue on GitHub using the button below.
        </p>
        <code>{JSON.stringify(fetchError) ?? "No error"}</code>
      </Modal>
      <NotEnoughPerformersModal
        show={showMinPerformersModal}
        closeModalHandler={() => setShowMinPerformersModal(false)}
      >
        <p>
          {fetchData?.findPerformers.count}{" "}
          {fetchData?.findPerformers.count === 1
            ? "performer was"
            : "performers were"}{" "}
          found in your library using your current tournament settings. The
          minimum number of performers is 2.
        </p>
        <p>
          Please update your tournament settings to include more performers.
        </p>
      </NotEnoughPerformersModal>
    </>
  );
};

export default HomePage;

/* ---------------------------------------------------------------------------------------------- */
/*                                 "Tournament in progress" modal                                 */
/* ---------------------------------------------------------------------------------------------- */

interface InProgressModalProps extends React.PropsWithChildren {
  /** Handler for closing the modal. */
  closeModalHandler: () => void;
  /** Handler for continuing with the action. */
  continueHandler: React.MouseEventHandler;
  /** Dictates whether the modal is currently rendered. */
  show: boolean;
}

const InProgressModal: React.FC<InProgressModalProps> = (props) => {
  return (
    <Modal
      buttons={[
        {
          element: "button",
          children: "No",
          className: "btn btn-secondary",
          onClick: props.closeModalHandler,
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
      title="Tournament in progress"
    >
      {props.children}
    </Modal>
  );
};

/* ---------------------------------------------------------------------------------------------- */
/*                                  "Not enough performers" modal                                 */
/* ---------------------------------------------------------------------------------------------- */

interface NotEnoughPerformersModalProps extends React.PropsWithChildren {
  /** Handler for closing the modal. */
  closeModalHandler: () => void;
  /** Dictates whether the modal is currently rendered. */
  show: boolean;
}

const NotEnoughPerformersModal: React.FC<NotEnoughPerformersModalProps> = (
  props
) => {
  return (
    <Modal
      buttons={[
        {
          element: "button",
          children: "Close",
          className: "btn btn-primary",
          onClick: props.closeModalHandler,
          type: "button",
        },
      ]}
      icon={faHand}
      show={props.show}
      title="Not enough performers"
    >
      {props.children}
    </Modal>
  );
};
