import React from "react";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons/faSpinnerThird";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./LoadingSpinner.module.scss";

const LoadingSpinner: React.FC = () => (
  <div role="status" className={styles.loading}>
    <FontAwesomeIcon icon={faSpinnerThird} spin />
    <span>Loading...</span>
  </div>
);

export default LoadingSpinner;
