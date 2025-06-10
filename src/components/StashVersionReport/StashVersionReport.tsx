import React from "react";
import type { OperationVariables, QueryResult } from "@apollo/client";
import type { StashVersionResult } from "@/apollo/schema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import { getStashVersionBreakdown } from "@/helpers/stash";
import styles from "./StashVersionReport.module.scss";

interface StashVersionReportProps {
  request: {
    loading: boolean;
    data: QueryResult<StashVersionResult, OperationVariables>["data"];
    error: QueryResult<StashVersionResult, OperationVariables>["error"];
  };
}

const StashVersionReport: React.FC<StashVersionReportProps> = (props) => {
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

  const [vMajor, vMinor, vPatch] = getStashVersionBreakdown(
    props.request.data?.version?.version ?? "vxx.yy.zz"
  );

  const versionString = vMajor + "." + vMinor + "." + vPatch;
  const versionWarnings: string[] = [];

  if (vMinor < 28)
    versionWarnings.push(
      "Glicko requires at least v0.28.0 in order to save performer ratings. With your current version, you will lose all ratings after ending a tournament."
    );

  const fullyCompatible = (
    <div>
      <FontAwesomeIcon
        className="mr-2"
        icon={faCircle}
        color={"var(--success)"}
      />
      This version is fully compatible with Glicko.
    </div>
  );

  const partiallyCompatible = (
    <div className={styles.breakdown}>
      <FontAwesomeIcon
        className="mr-2"
        icon={faCircle}
        color={"var(--warning)"}
      />
      This version is compatible with Glicko but with some limitations:
      <ul>
        {versionWarnings.map((w) => {
          return (
            <li>
              <FontAwesomeIcon
                className="mr-2"
                icon={faCircle}
                color={
                  "var(--" +
                  (versionWarnings.length ? "warning" : "success") +
                  ")"
                }
              />
              <span>{w}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div className={styles.VersionReport}>
      <div>
        <FontAwesomeIcon
          className="mr-2"
          icon={faCircle}
          color="var(--success)"
        />
        <span>Connected to Stash.</span>
      </div>
      <div>
        <FontAwesomeIcon
          className="mr-2"
          icon={faCircle}
          color={
            "var(--" + (versionWarnings.length ? "warning" : "success") + ")"
          }
        />
        <span>Version {versionString}</span>
      </div>
      {!versionWarnings.length ? fullyCompatible : null}
      {versionWarnings.length ? partiallyCompatible : null}
    </div>
  );
};

export default StashVersionReport;
