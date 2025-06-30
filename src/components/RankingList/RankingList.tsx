import React, { useState } from "react";
import { faSort } from "@fortawesome/pro-solid-svg-icons/faSort";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { default as cx } from "classnames";
import styles from "./RankingList.module.scss";
import { getStashUrl } from "@/helpers/stash";
import TextUtils from "@/utils/text";
import Pagination from "../Pagination/Pagination";
import { faChevronsUp } from "@fortawesome/pro-solid-svg-icons/faChevronsUp";
import { faChevronsDown } from "@fortawesome/pro-solid-svg-icons/faChevronsDown";
import { faPlus } from "@fortawesome/pro-solid-svg-icons/faPlus";

interface RankingListProps {
  /** The ranked performer performer data. */
  performers: RankedPerformer[];
  /** The array of ISO datetime strings of when each session concluded. */
  sessionHistory: Date[];
}

interface SortMethod {
  name: "date" | "losses" | "matches" | "name" | "rating" | "ties" | "wins";
  sorter: (performers: RankedPerformer[]) => RankedPerformer[];
}

const RankingList: React.FC<RankingListProps> = (props) => {
  /* ------------------------------------------- Sorting ------------------------------------------ */

  const perPage = 25;
  const [currentData, setCurrentData] = useState<RankedPerformer[]>(
    sortByRating(props.performers).filter((_p, i) => i < perPage)
  );
  const [collapsed, setCollapsed] = useState(true);
  const [method, setMethod] = useState<SortMethod>(sortMethodRating);
  const [reverse, setReverse] = useState(false);
  const [page, setPage] = useState(1);

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

  const collapseClasses = cx("btn", "btn-primary", styles.collapse);

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
              const link = getStashUrl("/performers/" + p.id);
              const opponentData = p.recentOpponent ? (
                <a
                  href={getStashUrl("/performers/" + p.recentOpponent.id)}
                  target="_blank"
                >
                  {p.recentOpponent.name}
                </a>
              ) : (
                "-"
              );

              return (
                <tr key={i}>
                  <th scope="row">
                    <span>{p.rank}</span>
                    <RankChangeIcon
                      new={p.sessions[0].n}
                      prev={p.sessions[1]?.n}
                    />
                  </th>
                  <td>
                    <a href={link} target="_blank">
                      {p.name}
                    </a>
                  </td>
                  <td>
                    <span>{Math.floor(p.rating)}</span>
                  </td>
                  <td>
                    <span>{p.wins}</span>
                  </td>
                  <td>
                    <span>{p.losses}</span>
                  </td>
                  <td>
                    <span>{p.ties}</span>
                  </td>
                  <td>
                    <span> {p.matches}</span>
                  </td>
                  <td>{opponentData}</td>
                  <td>
                    {p.recentOpponent.outcome === 1
                      ? "Won"
                      : p.recentOpponent.outcome === 0
                      ? "Lost"
                      : "Tie"}
                  </td>
                  <td>
                    {TextUtils.dateTimeToString(
                      new Date(p.recentOpponent.date)
                    )}
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

const sortByName = (performers: RankedPerformer[]): RankedPerformer[] => {
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

const sortByRating = (performers: RankedPerformer[]): RankedPerformer[] => {
  const newSort = performers.sort((a, b) => b.rating - a.rating);
  return newSort;
};

const sortMethodRating = {
  name: "rating",
  sorter: sortByRating,
} as const;

const sortByWins = (performers: RankedPerformer[]): RankedPerformer[] => {
  const newSort = performers.sort((a, b) => {
    return b.wins - a.wins;
  });
  return newSort;
};

const sortMethodWins = {
  name: "wins",
  sorter: sortByWins,
} as const;

const sortByLosses = (performers: RankedPerformer[]): RankedPerformer[] => {
  const newSort = performers.sort((a, b) => {
    return b.losses - a.losses;
  });
  return newSort;
};

const sortMethodLosses = {
  name: "losses",
  sorter: sortByLosses,
} as const;

const sortByTies = (performers: RankedPerformer[]): RankedPerformer[] => {
  const newSort = performers.sort((a, b) => {
    return b.ties - a.ties;
  });
  return newSort;
};

const sortMethodTies = {
  name: "ties",
  sorter: sortByTies,
} as const;

const sortByMatches = (performers: RankedPerformer[]): RankedPerformer[] => {
  const newSort = performers.sort((a, b) => {
    return b.matches - a.matches;
  });
  return newSort;
};

const sortMethodMatches = {
  name: "matches",
  sorter: sortByMatches,
} as const;

const sortByDate = (performers: RankedPerformer[]): RankedPerformer[] => {
  const newSort = performers.sort((a, b) => {
    return +new Date(b.recentOpponent.date) - +new Date(a.recentOpponent.date);
  });
  return newSort;
};

const sortMethodDate = {
  name: "date",
  sorter: sortByDate,
} as const;

/* ---------------------------------------------------------------------------------------------- */
/*                                        Rank change icon                                        */
/* ---------------------------------------------------------------------------------------------- */

interface RankChangeIconProps {
  new: number;
  prev?: number;
}

const RankChangeIcon: React.FC<RankChangeIconProps> = (props) => {
  // New entry
  if (!props.prev)
    return (
      <FontAwesomeIcon icon={faPlus} className="ml-1 small text-warning" />
    );

  // Lower rank
  if (props.prev < props.new)
    return (
      <FontAwesomeIcon
        icon={faChevronsDown}
        className="ml-1 small text-danger"
      />
    );

  // Higher rank
  if (props.prev > props.new)
    return (
      <FontAwesomeIcon
        icon={faChevronsUp}
        className="ml-1 small text-success"
      />
    );

  // No change in rank
  return null;
};
