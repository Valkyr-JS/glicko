import React from "react";
import { default as cx } from "classnames";
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
  // Add the "Continue tournament" option if required
  const ContinueItem = () =>
    props.inProgress ? (
      <li>
        <button
          type="button"
          className="btn btn-primary"
          onClick={props.newTournamentHandler}
        >
          Continue tournament
        </button>
      </li>
    ) : null;

  const classes = cx("container", styles.Home);
  return (
    <main className={classes}>
      <nav>
        <ul>
          <ContinueItem />
          <li>
            <button
              type="button"
              className="btn btn-primary"
              onClick={props.newTournamentHandler}
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
  );
};

export default HomePage;
