import { faCircleNotch } from "@fortawesome/pro-solid-svg-icons/faCircleNotch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const LoadingSpinner: React.FC = () => (
  <div>
    <FontAwesomeIcon icon={faCircleNotch} spin />
    <span>Loading...</span>
  </div>
);

export default LoadingSpinner;
