import React from "react";
import type { OperationVariables, QueryResult } from "@apollo/client";
import type { StashVersion } from "@/apollo/schema";
import styles from "./StashVersionReport.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";

interface StashVersionReportProps {
  request: {
    loading: boolean;
    data: QueryResult<StashVersion, OperationVariables>["data"];
    error: QueryResult<StashVersion, OperationVariables>["error"];
  };
}

const StashVersionReport: React.FC<StashVersionReportProps> = (props) => {
  console.log(props);

  if (props.request.loading) {
    return (
      <div className={styles.VersionReport}>
        <FontAwesomeIcon className="mr-2" icon={faSpinnerThird} spin />
        <span>Attempting to connect to Stash...</span>
      </div>
    );
  } else if (props.request.error) {
    return (
      <div className={styles.VersionReport}>
        <FontAwesomeIcon
          className="mr-2"
          icon={faCircle}
          color="var(--danger)"
        />
        <span>Unable to connect to Stash. Please check your connection.</span>
      </div>
    );
  }

  return (
    <div className={styles.VersionReport}>
      <FontAwesomeIcon
        className="mr-2"
        icon={faCircle}
        color="var(--success)"
      />
      <span>Connected to Stash.</span>
    </div>
  );
};

export default StashVersionReport;
