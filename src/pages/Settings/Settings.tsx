import React from "react";
import { default as cx } from "classnames";
import styles from "./Settings.module.scss";

interface SettingsPageProps {
  /** Dictates whether a tournament is in progress. */
  inProgress: boolean;
}

const SettingsPage: React.FC<SettingsPageProps> = (props) => {
  console.log(props.inProgress);

  const classes = cx("container", styles.Settings);

  return (
    <main className={classes}>
      <h1>Tournament settings</h1>
    </main>
  );
};

export default SettingsPage;
