import React from "react";

interface SettingsPageProps {
  /** Dictates whether a tournament is in progress. */
  inProgress: boolean;
}

const SettingsPage: React.FC<SettingsPageProps> = (props) => {
  console.log(props.inProgress);
  return <main>Settings</main>;
};

export default SettingsPage;
