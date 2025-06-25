import React, { useState } from "react";
import { faSort } from "@fortawesome/pro-solid-svg-icons/faSort";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { default as cx } from "classnames";
import type { StashPerformer } from "@/apollo/schema";
import { GLICKO } from "@/constants";
import styles from "./RankingList.module.scss";
import { getStashUrl } from "@/helpers/stash";
import TextUtils from "@/utils/text";
import Pagination from "../Pagination/Pagination";

interface RankingListProps {
  /** The performer data including their glicko data. */
  performers: StashPerformer[];
  /** The array of ISO datetime strings of when each session concluded. */
  sessionHistory: Date[];
}

interface SortMethod {
  name: "date" | "losses" | "matches" | "name" | "rating" | "ties" | "wins";
  sorter: (performers: StashPerformer[]) => StashPerformer[];
}

const RankingList: React.FC<RankingListProps> = (props) => {
  /* ------------------------------------------- Sorting ------------------------------------------ */

  const perPage = 25;
  const [currentData, setCurrentData] = useState<StashPerformer[]>(
    sortByRating(props.performers).filter((_p, i) => i < perPage)
  );
  const [collapsed, setCollapsed] = useState(true);
  const [method, setMethod] = useState<SortMethod>(sortMethodRating);
  const [reverse, setReverse] = useState(false);
  const [page, setPage] = useState(1);

  // Used for rank placement
  const allByRank = sortByRating(props.performers);

  const filterForPage = (i: number, page: number) =>
    i < page * perPage && i >= (page - 1) * perPage;

  /** Helper to update the currently displayed data by the given sort method. */
  const handleSortClick = (newMethod: SortMethod) => {
    // Identify if this is a different method from the current
    const isChangedMethod = method.name !== newMethod.name;
    if (isChangedMethod) setMethod(newMethod);

    // If the method has not changed, reverse the current order otherwise no
    // reverse
    const isReversed = isChangedMethod ? false : !reverse;
    setReverse(isReversed);

    // First sort alphabetically so that equal values are sorted as such
    const alpha = sortMethodName.sorter(props.performers);

    // Then sort by the new method
    const sorted = newMethod.sorter(alpha);

    // Reverse the order if needed
    const reversed = isReversed ? sorted.reverse() : sorted;

    // Then get the current slice of data
    const pageData = reversed.filter((_p, i) => filterForPage(i, 1));
    setCurrentData(pageData);
    setPage(1);
  };

  const handleClickSortDate = () => handleSortClick(sortMethodDate);
  const handleClickSortLosses = () => handleSortClick(sortMethodLosses);
  const handleClickSortMatches = () => handleSortClick(sortMethodMatches);
  const handleClickSortName = () => handleSortClick(sortMethodName);
  const handleClickSortRank = () => handleSortClick(sortMethodRating);
  const handleClickSortTies = () => handleSortClick(sortMethodTies);
  const handleClickSortWins = () => handleSortClick(sortMethodWins);

  /* ------------------------------------------- Toolbar ------------------------------------------ */

  /** Handle clicking the Expand/Collapse button */
  const handleCollapseTable: React.MouseEventHandler = () =>
    setCollapsed(!collapsed);

  const lastPage = Math.ceil(props.performers.length / perPage);

  /** Handle clicking a page button. */
  const handlePaginationClick = (newPage: number) => {
    setPage(newPage);

    // First sort the performers
    const sorted = method.sorter(props.performers);

    // Reverse the order if needed
    const reversed = reverse ? sorted.reverse() : sorted;

    // Then get the current slice of data
    const pageData = reversed.filter((_p, i) => filterForPage(i, newPage));
    setCurrentData(pageData);
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
      <div className={styles.pagination}>
        <Pagination
          count={lastPage}
          current={page}
          setCurrent={handlePaginationClick}
        />
      </div>
    </div>
  );

  /* ------------------------------------------ Component ----------------------------------------- */

  const tableWrapperClasses = cx("mb-3", {
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
              <th scope="col">
                <SortButton onClick={handleClickSortRank}>Rank</SortButton>
              </th>
              <th scope="col">
                <SortButton onClick={handleClickSortName}>Performer</SortButton>
              </th>
              <th scope="col">Rating</th>
              <th scope="col">
                <SortButton onClick={handleClickSortWins}>Wins</SortButton>
              </th>
              <th scope="col">
                <SortButton onClick={handleClickSortLosses}>Losses</SortButton>
              </th>
              <th scope="col">
                <SortButton onClick={handleClickSortTies}>Ties</SortButton>
              </th>
              <th scope="col">
                <SortButton onClick={handleClickSortMatches}>
                  Matches
                </SortButton>
              </th>
              <th scope="col">Most recent matchup</th>
              <th scope="col">Outcome</th>
              <th scope="col">
                <SortButton onClick={handleClickSortDate}>Date</SortButton>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((p, i) => {
              const matchHistory: PerformerMatchRecord[] = JSON.parse(
                p.custom_fields?.glicko_match_history ?? "[]"
              );
              const link = getStashUrl("/performers/" + p.id);
              const recentMatch = matchHistory.sort(
                (a, b) => +new Date(b.s) - +new Date(a.s)
              )[0];
              const recentOpponent = props.performers.find(
                (p) => +p.id === +recentMatch.id
              );
              const opponentData = recentOpponent ? (
                <a
                  href={getStashUrl("/performers/" + recentOpponent.id)}
                  target="_blank"
                >
                  {recentOpponent.name}
                </a>
              ) : (
                "-"
              );

              return (
                <tr key={i}>
                  <th scope="row">
                    <span>{allByRank.findIndex((r) => r.id === p.id) + 1}</span>
                  </th>
                  <td>
                    <a href={link} target="_blank">
                      {p.name}
                    </a>
                  </td>
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
                  <td>{opponentData}</td>
                  <td>
                    {matchHistory.length
                      ? recentMatch.r === 1
                        ? "Won"
                        : recentMatch.r === 0
                        ? "Lost"
                        : "Tie"
                      : "-"}
                  </td>
                  <td>
                    {matchHistory.length
                      ? TextUtils.dateTimeToString(new Date(recentMatch.s))
                      : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {toolbar}
    </section>
  );
};

export default RankingList;

/* ---------------------------------------------------------------------------------------------- */
/*                                             Sorting                                            */
/* ---------------------------------------------------------------------------------------------- */

const SortButton: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
> = (props) => {
  return (
    <button {...props} className={styles.SortButton} type="button">
      <span className="mr-3">{props.children}</span>
      <FontAwesomeIcon icon={faSort} />
    </button>
  );
};

const sortByName = (performers: StashPerformer[]): StashPerformer[] => {
  const newSort = performers.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
  });
  return newSort;
};

const sortMethodName = {
  name: "name",
  sorter: sortByName,
} as const;

const sortByRating = (performers: StashPerformer[]): StashPerformer[] => {
  const newSort = performers.sort(
    (a, b) =>
      (b.custom_fields?.glicko_rating ?? GLICKO.RATING_DEFAULT) -
      (a.custom_fields?.glicko_rating ?? GLICKO.RATING_DEFAULT)
  );
  return newSort;
};

const sortMethodRating = {
  name: "rating",
  sorter: sortByRating,
} as const;

const sortByWins = (performers: StashPerformer[]): StashPerformer[] => {
  const newSort = performers.sort((a, b) => {
    const getRecord = (records: PerformerMatchRecord[]) =>
      records.filter((m) => m.r === 1).length;

    const aWins = getRecord(
      JSON.parse(a.custom_fields?.glicko_match_history ?? "[]")
    );

    const bWins = getRecord(
      JSON.parse(b.custom_fields?.glicko_match_history ?? "[]")
    );

    return bWins - aWins;
  });
  return newSort;
};

const sortMethodWins = {
  name: "wins",
  sorter: sortByWins,
} as const;

const sortByLosses = (performers: StashPerformer[]): StashPerformer[] => {
  const newSort = performers.sort((a, b) => {
    const getRecord = (records: PerformerMatchRecord[]) =>
      records.filter((m) => m.r === 0).length;

    const aLosses = getRecord(
      JSON.parse(a.custom_fields?.glicko_match_history ?? "[]")
    );

    const bLosses = getRecord(
      JSON.parse(b.custom_fields?.glicko_match_history ?? "[]")
    );

    return bLosses - aLosses;
  });
  return newSort;
};

const sortMethodLosses = {
  name: "losses",
  sorter: sortByLosses,
} as const;

const sortByTies = (performers: StashPerformer[]): StashPerformer[] => {
  const newSort = performers.sort((a, b) => {
    const getRecord = (records: PerformerMatchRecord[]) =>
      records.filter((m) => m.r === 0.5).length;

    const aTies = getRecord(
      JSON.parse(a.custom_fields?.glicko_match_history ?? "[]")
    );

    const bTies = getRecord(
      JSON.parse(b.custom_fields?.glicko_match_history ?? "[]")
    );

    return bTies - aTies;
  });
  return newSort;
};

const sortMethodTies = {
  name: "ties",
  sorter: sortByTies,
} as const;

const sortByMatches = (performers: StashPerformer[]): StashPerformer[] => {
  const newSort = performers.sort((a, b) => {
    const getRecord = (records: PerformerMatchRecord[]) => records.length;

    const aCount = getRecord(
      JSON.parse(a.custom_fields?.glicko_match_history ?? "[]")
    );

    const bCount = getRecord(
      JSON.parse(b.custom_fields?.glicko_match_history ?? "[]")
    );

    return bCount - aCount;
  });
  return newSort;
};

const sortMethodMatches = {
  name: "matches",
  sorter: sortByMatches,
} as const;

const sortByDate = (performers: StashPerformer[]): StashPerformer[] => {
  const newSort = performers.sort((a, b) => {
    const getRecord = (records: PerformerMatchRecord[]) =>
      records.sort((c, d) => +new Date(d.s) - +new Date(c.s))[0];

    const aDate = getRecord(
      JSON.parse(a.custom_fields?.glicko_match_history ?? "[]")
    );

    const bDate = getRecord(
      JSON.parse(b.custom_fields?.glicko_match_history ?? "[]")
    );

    return +new Date(bDate.s) - +new Date(aDate.s);
  });
  return newSort;
};

const sortMethodDate = {
  name: "date",
  sorter: sortByDate,
} as const;
