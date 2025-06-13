import React from "react";
import { default as cx } from "classnames";
import styles from "./ProgressBoard.module.scss";
import { DEFAULT_MAX_PROGRESS_BOARD_ROWS } from "@/constants";

interface ProgressBoardProps {
  /** The column titles. */
  columnTitles: [columnA: string, columnB: string];
  /** Minimal performer data used for getting names from the IDs in the results. */
  performerData: StashSlimPerformerData[];
  /** The column data, and the index of the winner. */
  results: GlickoMatchResult[];
  /** The maximum number of rows to be displayed as set by the user. */
  maxRows?: number;
  /** Whether to display the progress in reverse order, i.e. latest > oldest
   * instead of oldest > latest. */
  reverse?: boolean;
  /** The progress board title. */
  title?: string;
}

/** A component displaying the results of an in-progress tournament. */
const ProgressBoard: React.FC<ProgressBoardProps> = (props) => {
  /** Get the performer's name from their ID */
  const getNameFromID = (id: number) =>
    props.performerData.find((p) => p.id === id)?.name ?? "<Name not found>";

  /** Convert match results to show performer names */
  const nameMatches = (m: GlickoMatchResult) => {
    const p1 = getNameFromID(m[0]);
    const p2 = getNameFromID(m[1]);
    return [p1, p2, m[2]];
  };

  const tableData = props.reverse
    ? [...props.results.map(nameMatches)].reverse()
    : [...props.results.map(nameMatches)];

  const noDataRow = (
    <tr>
      <td colSpan={3}>Match results have yet to be recorded.</td>
    </tr>
  );

  const title = props.title ? <h2>{props.title}</h2> : null;

  return (
    <section className={styles["progress-board"]}>
      {title}
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Round #</th>
            <th scope="col">{props.columnTitles[0]}</th>
            <th scope="col">{props.columnTitles[1]}</th>
          </tr>
        </thead>
        <tbody>
          {tableData.length === 0
            ? noDataRow
            : tableData.map((rowData, i) => {
                if (i < (props.maxRows ?? DEFAULT_MAX_PROGRESS_BOARD_ROWS)) {
                  const round = props.reverse ? tableData.length - i : i + 1;
                  const cell1Classes = cx({
                    [styles["winner"]]: rowData[2] === 1,
                  });
                  const cell2Classes = cx({
                    [styles["winner"]]: rowData[2] === 0,
                  });
                  return (
                    <tr key={round}>
                      <td>{round}</td>
                      <td className={cell1Classes}>{rowData[0]}</td>
                      <td className={cell2Classes}>{rowData[1]}</td>
                    </tr>
                  );
                } else return null;
              })}
        </tbody>
      </table>
    </section>
  );
};

export default ProgressBoard;
