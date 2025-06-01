import React, { useState } from "react";
import { default as cx } from "classnames";
import { faHand } from "@fortawesome/pro-solid-svg-icons";
import Modal from "@/components/Modal/Modal";
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
  const [showModal, setShowModal] = useState(false);

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
    HTMLButtonElement
  > = () => {
    // If there is already a tournament in progress, display the modal. Else
    // continue.
    if (props.inProgress) setShowModal(true);
    else props.newTournamentHandler();
  };

  const classes = cx("container", styles.Home);
  return (
    <>
      <main className={classes}>
        <nav>
          <ul>
            <ContinueItem />
            <li>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNewTournament}
              >
                New tournament
              </button>
            </li>
            <li>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={props.changeFiltersHandler}
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
      </main>
      <Modal
        buttons={[
          {
            children: "Cancel",
            className: "btn btn-secondary",
            onClick: () => setShowModal(false),
            type: "button",
          },
          {
            children: "Continue",
            className: "btn btn-danger",
            onClick: props.newTournamentHandler,
            type: "button",
          },
        ]}
        icon={faHand}
        show={showModal}
        title="Tournament in progress"
      >
        <p>
          A tournament is already in progress. If you start a new tournament,
          your previous progress will be deleted. This cannot be undone.
        </p>
        <p>Would you still like to start a new tournament?</p>
      </Modal>
    </>
  );
};

export default HomePage;
