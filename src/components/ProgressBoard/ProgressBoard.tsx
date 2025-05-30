import React from "react";
import { default as cx } from "classnames";
import styles from "./ProgressBoard.module.scss";

interface ProgressBoardProps {
  /** The column titles. */
  columnTitles: [columnA: string, columnB: string];
  /** Whether to display the progress in reverse order, i.e. latest > oldest
   * instead of oldest > latest. */
  reverse?: boolean;
  /** The column data, and the index of the winner. */
  tableData: [optionA: string, optionB: string, winner: 0 | 0.5 | 1][];
  /** The progress board title. */
  title: string;
}

/** A component displaying the results of an in-progress tournament. */
const ProgressBoard: React.FC<ProgressBoardProps> = (props) => {
  const tableData = props.reverse
    ? [...props.tableData].reverse()
    : props.tableData;

  const noDataRow = (
    <tr>
      <td colSpan={3}>The tournament has not yet started.</td>
    </tr>
  );

  return (
    <section className={styles["progress-board"]}>
      <h2>{props.title}</h2>
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
                const round = props.reverse ? tableData.length - i : i + 1;
                const cell1Classes = cx({
                  [styles["winner"]]: rowData[2] === 0,
                });
                const cell2Classes = cx({
                  [styles["winner"]]: rowData[2] === 1,
                });
                return (
                  <tr key={round}>
                    <td>{round}</td>
                    <td className={cell1Classes}>{rowData[0]}</td>
                    <td className={cell2Classes}>{rowData[1]}</td>
                  </tr>
                );
              })}
        </tbody>
      </table>
    </section>
  );
};

export default ProgressBoard;
