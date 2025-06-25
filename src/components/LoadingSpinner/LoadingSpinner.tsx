import React from "react";
import { faCircleNotch } from "@fortawesome/pro-solid-svg-icons/faCircleNotch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./LoadingSpinner.module.scss";

const LoadingSpinner: React.FC = () => (
  <div role="status" className={styles.loading}>
    <FontAwesomeIcon icon={faCircleNotch} spin />
    <span>Loading...</span>
  </div>
);

export default LoadingSpinner;
