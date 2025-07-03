import React from "react";
import { default as cx } from "classnames";
import styles from "./SettingSection.module.scss";

interface SettingSectionProps extends React.PropsWithChildren {
  /** The section heading, displayed above the section. */
  heading?: string;
}

const classes = cx("setting-section", styles.SettingSection);

const SettingSection: React.FC<SettingSectionProps> = (props) => {
  console.log(props);
  return <div className={classes}>{props.children}</div>;
};

export default SettingSection;
