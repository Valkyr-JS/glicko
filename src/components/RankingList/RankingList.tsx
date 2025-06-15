import React, { useState } from "react";
import { default as cx } from "classnames";
import type { StashPerformer } from "@/apollo/schema";
import styles from "./RankingList.module.scss";
import { GLICKO } from "@/constants";

interface RankingListProps {
  /** The performer data including their glicko data. */
  performers: StashPerformer[];
  /** The array of ISO datetime strings of when each session concluded. */
  sessionHistory: Date[];
}

const RankingList: React.FC<RankingListProps> = (props) => {
  /* ------------------------------------------- Sorting ------------------------------------------ */

  const perPage = 25;
  const [currentData, setCurrentData] = useState<StashPerformer[]>(
    sortByRating(props.performers).filter((_p, i) => i < perPage)
  );
  const [collapsed, setCollapsed] = useState(true);
  const [page, setPage] = useState(1);

  // Used for rank placement
  const allByRank = sortByRating(props.performers);

  /* ------------------------------------------- Toolbar ------------------------------------------ */

  /** Handle clicking the Expand/Collapse button */
  const handleCollapseTable: React.MouseEventHandler = () =>
    setCollapsed(!collapsed);

  const lastPage = Math.ceil(props.performers.length / perPage);

  /** Handle clicking a page button. */
  const handlePaginationClick = (newPage: number) => {
    setPage(newPage);

    // First sort the performers
    const sorted = sortByRating(props.performers);

    // Then get the current slice of data
    const pageData = sorted.filter(
      (_p, i) => i < newPage * perPage && i >= (newPage - 1) * perPage
    );
    setCurrentData(pageData);
  };

  const pageButtons = () => {
    const btnArr = [];
    for (let i = 0; i < lastPage; i++) {
      /**
       * If there are 8 or more pages, not all buttons will be rendered. Only
       * render buttons for :
       * The first page
       * The last page
       * The current page
       * The pages either side of the current page
       */
      const isFewButtons = lastPage < 8;
      const isFirstPage = i === 0;
      const isLastPage = i === lastPage - 1;
      const isCurrentPage = i === page - 1;
      const isPreviousPage = i === page - 2;
      const isNextPage = i === page;
      const willRender =
        isFewButtons ||
        isFirstPage ||
        isLastPage ||
        isCurrentPage ||
        isPreviousPage ||
        isNextPage;

      if (willRender)
        btnArr.push(
          <button
            key={i}
            type="button"
            className="btn btn-secondary"
            disabled={i === page - 1}
            onClick={() => handlePaginationClick(i + 1)}
          >
            {i + 1}
          </button>
        );
      // Show an ellipsis between jumps
      else {
        const isNextNextPage = i === page + 1;
        const isPreviousPreviousPage = i === page - 3;
        if (isNextNextPage || isPreviousPreviousPage)
          btnArr.push(<span style={{ verticalAlign: "bottom" }}>...</span>);
      }
    }
    return btnArr;
  };

  const collapseClasses = cx("btn", "btn-secondary", styles.collapse);

  const toolbar = (
    <div className={styles.toolbar}>
      <button
        type="submit"
        className={collapseClasses}
        onClick={handleCollapseTable}
      >
        {collapsed ? "Expand" : "Collapse"}
      </button>
      <div className={styles.pagination}>{pageButtons()}</div>
    </div>
  );

  /* ------------------------------------------ Component ----------------------------------------- */

  const tableWrapperClasses = cx({
    "table-responsive": !collapsed,
    [styles.expanded]: !collapsed,
  });

  return (
    <section className={styles.RankingList}>
      {toolbar}
      <div className={tableWrapperClasses}>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">Performer</th>
              <th scope="col">Rating</th>
              <th scope="col">Wins</th>
              <th scope="col">Losses</th>
              <th scope="col">Ties</th>
              <th scope="col">Matches</th>
              <th scope="col">Most recent matchup</th>
              <th scope="col">Outcome</th>
              <th scope="col">Date</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((p, i) => {
              const matchHistory: PerformerMatchRecord[] = JSON.parse(
                p.custom_fields?.glicko_match_history ?? "[]"
              );
              return (
                <tr key={i}>
                  <th scope="row">
                    <span>{allByRank.findIndex((r) => r.id === p.id) + 1}</span>
                  </th>
                  <td>{p.name}</td>
                  <td>
                    <span>
                      {Math.round(
                        p.custom_fields?.glicko_rating ?? GLICKO.RATING_DEFAULT
                      )}
                    </span>
                  </td>
                  <td>
                    <span>
                      {matchHistory.length
                        ? matchHistory.filter((m) => m.r === 1).length
                        : "-"}
                    </span>
                  </td>
                  <td>
                    <span>
                      {matchHistory.length
                        ? matchHistory.filter((m) => m.r === 0).length
                        : "-"}
                    </span>
                  </td>
                  <td>
                    <span>
                      {matchHistory.length
                        ? matchHistory.filter((m) => m.r === 0.5).length
                        : "-"}
                    </span>
                  </td>
                  <td>
                    <span>{matchHistory.length}</span>
                  </td>
                  <td>
                    {matchHistory.length
                      ? props.performers.find(
                          (p) => p.id === +matchHistory[0].id
                        )?.name
                      : "-"}
                  </td>
                  <td>
                    {matchHistory.length
                      ? matchHistory[0].r === 1
                        ? "Won"
                        : matchHistory[0].r === 0
                        ? "Lost"
                        : "Tie"
                      : "-"}
                  </td>
                  <td>
                    {matchHistory.length
                      ? new Date(matchHistory[0].s).toDateString()
                      : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {toolbar}
      </div>
    </section>
  );
};

export default RankingList;

const sortByRating = (performers: StashPerformer[]) => {
  const newSort = performers.sort(
    (a, b) =>
      (b.custom_fields?.glicko_rating ?? GLICKO.RATING_DEFAULT) -
      (a.custom_fields?.glicko_rating ?? GLICKO.RATING_DEFAULT)
  );
  return newSort;
};
