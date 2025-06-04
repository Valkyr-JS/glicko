import React, { useState } from "react";
import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
import { faChessRook } from "@fortawesome/pro-solid-svg-icons/faChessRook";
import { faHand } from "@fortawesome/pro-solid-svg-icons/faHand";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons/faSpinnerThird";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { default as cx } from "classnames";
import { useNavigate } from "react-router";
import Modal from "@/components/Modal/Modal";
import { PATH } from "@/constants";
import styles from "./Home.module.scss";

interface HomePageProps {
  /** Click handler for continuing a saved tournament. */
  continueTournamentHandler: () => void;
  /** Dictates whether a tournament is in progress. */
  inProgress: boolean;
  /** Dictates whether data is currently being loaded for a tournament. */
  isLoading: boolean;
}

const HomePage: React.FC<HomePageProps> = (props) => {
  const [showChangeSettingsModal, setShowChangeSettingsModal] = useState(false);
  const [showNewTournamentModal, setShowNewTournamentModal] = useState(false);

  const navigate = useNavigate();

  const classes = cx("container", styles.Home);

  /* --------------------------------- Continue tournament button --------------------------------- */

  // Add the "Continue tournament" option if required
  const ContinueItem = () =>
    props.inProgress ? (
      <li>
        <button
          type="button"
          className="btn btn-primary"
          onClick={props.continueTournamentHandler}
        >
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
  > = () => {
    // If there is already a tournament in progress, display the modal. Else
    // continue.
    if (props.inProgress) setShowNewTournamentModal(true);
    else navigate(PATH.TOURNAMENT);
  };

  const newTournamentButton = (
    <button
      className={newTournamentClasses}
      disabled={props.isLoading}
      onClick={handleNewTournament}
    >
      {props.isLoading && !props.inProgress ? (
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
    else navigate(PATH.SETTINGS);
  };

  const tournamentSettingsButton = (
    <button className="btn btn-secondary" onClick={handleChangeSettings}>
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
              <a className="btn btn-secondary" href="#">
                About
              </a>
            </li>
          </ul>
        </nav>
        <footer>
          <a href="https://github.com/Valkyr-JS/glicko">
            <FontAwesomeIcon icon={faGithub} />
            <span className="sr-only">Visit the Github repository</span>
          </a>
        </footer>
      </main>
      <InProgressModal
        closeModalHandler={() => setShowNewTournamentModal(false)}
        continueHandler={() => navigate(PATH.TOURNAMENT)}
        show={showNewTournamentModal}
      >
        <p>
          A tournament is already in progress. If you start a new tournament,
          your previous progress will be deleted. This cannot be undone.
        </p>
        <p>Would you still like to start a new tournament?</p>
      </InProgressModal>
      <InProgressModal
        closeModalHandler={() => setShowChangeSettingsModal(false)}
        continueHandler={() => navigate(PATH.SETTINGS)}
        show={showChangeSettingsModal}
      >
        <p>
          A tournament is already in progress. If you change your tournament
          settings, your previous progress will be deleted. This cannot be
          undone.
        </p>
        <p>Would you still like to update the settings?</p>
      </InProgressModal>
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
  continueHandler: () => void;
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
