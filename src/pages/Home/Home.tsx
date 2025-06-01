import React, { useState } from "react";
import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
import { faChessRook } from "@fortawesome/pro-solid-svg-icons/faChessRook";
import { faHand } from "@fortawesome/pro-solid-svg-icons/faHand";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { default as cx } from "classnames";
import { Link } from "react-router";
import Modal from "@/components/Modal/Modal";
import { PATH } from "@/constants";
import styles from "./Home.module.scss";

interface HomeProps {
  /** Click handler for changing the tournament filters. */
  changeFiltersHandler: () => void;
  /** Click handler for continuing a saved tournament. */
  continueTournamentHandler: () => void;
  /** Dictates whether a tournament is in progress. */
  inProgress: boolean;
  /** Click handler for starting a new tournament. */
  newTournamentHandler: () => void;
}

const HomePage: React.FC<HomeProps> = (props) => {
  const [showChangeFiltersModal, setShowChangeFiltersModal] = useState(false);
  const [showNewTournamentModal, setShowNewTournamentModal] = useState(false);

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

  /** Handle clicking the new tournament button. */
  const handleNewTournament: React.MouseEventHandler<
    HTMLAnchorElement
  > = () => {
    // If there is already a tournament in progress, display the modal. Else
    // continue.
    if (props.inProgress) setShowNewTournamentModal(true);
    else props.newTournamentHandler();
  };

  /** Handle clicking the change filters button */
  const handleChangeFilters: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    // If there is already a tournament in progress, display the modal. Else
    // continue.
    if (props.inProgress) setShowChangeFiltersModal(true);
    else props.changeFiltersHandler();
  };

  const classes = cx("container", styles.Home);
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
            <li>
              <Link
                className="btn btn-primary"
                onClick={handleNewTournament}
                to={PATH.TOURNAMENT}
              >
                New tournament
              </Link>
            </li>
            <li>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleChangeFilters}
              >
                Change filters
              </button>
            </li>
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
        continueHandler={props.newTournamentHandler}
        show={showNewTournamentModal}
      >
        <p>
          A tournament is already in progress. If you start a new tournament,
          your previous progress will be deleted. This cannot be undone.
        </p>
        <p>Would you still like to start a new tournament?</p>
      </InProgressModal>
      <InProgressModal
        closeModalHandler={() => setShowChangeFiltersModal(false)}
        continueHandler={props.changeFiltersHandler}
        show={showChangeFiltersModal}
      >
        <p>
          A tournament is already in progress. If you update your filters, your
          previous progress will be deleted. This cannot be undone.
        </p>
        <p>Would you still like to update the filters?</p>
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
          children: "Cancel",
          className: "btn btn-secondary",
          onClick: props.closeModalHandler,
          type: "button",
        },
        {
          children: "Continue",
          className: "btn btn-danger",
          onClick: props.continueHandler,
          type: "button",
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
