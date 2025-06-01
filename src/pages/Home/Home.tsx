import React from "react";
import { default as cx } from "classnames";
import styles from "./Home.module.scss";

interface HomeProps {
  /** Click handler for changing the tournament filters. */
  changeFiltersHandler: () => void;
  /** Click handler for starting a new tournament. */
  newTournamentHandler: () => void;
}

const HomePage: React.FC<HomeProps> = (props) => {
  const classes = cx("container", styles.Home);
  return (
    <main className={classes}>
      <nav>
        <ul>
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
