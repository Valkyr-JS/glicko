import React from "react";
import type { OperationVariables, QueryResult } from "@apollo/client";
import type { StashVersion } from "@/apollo/schema";
import styles from "./StashVersionReport.module.scss";

interface StashVersionReportProps {
  request: {
    loading: boolean;
    data: QueryResult<StashVersion, OperationVariables>["data"];
    error: QueryResult<StashVersion, OperationVariables>["error"];
  };
}

const StashVersionReport: React.FC<StashVersionReportProps> = (props) => {
  console.log(props);

  const connectionSuccessful = !props.request.loading && !props.request.error;

  const connectionMessage = connectionSuccessful ? (
    <div>Connected to Stash</div>
  ) : (
    <div>Unable to connect to Stash. Please check your connection.</div>
  );

  return <div className={styles.VersionReport}>{connectionMessage}</div>;
};

export default StashVersionReport;
