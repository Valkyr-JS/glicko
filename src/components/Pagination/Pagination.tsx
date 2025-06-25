import { faChevronsLeft } from "@fortawesome/pro-solid-svg-icons/faChevronsLeft";
import { faChevronsRight } from "@fortawesome/pro-solid-svg-icons/faChevronsRight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface PaginationProps {
  /** The total number of pages. */
  count: number;
  /** The current page number */
  current: number;
  /** Set the new page number */
  setCurrent: (newCurrent: number) => void;
}

const Pagination: React.FC<PaginationProps> = (props) => {
  console.log(props);

  /* -------------------------------------- First page button ------------------------------------- */

  const firstButtonDisabled = props.current === 1;
  const handleFirstButtonClick: React.MouseEventHandler = () =>
    props.setCurrent(1);

  /* -------------------------------------- Last page button -------------------------------------- */

  const lastButtonDisabled = props.current === props.count;
  const handleLastButtonClick: React.MouseEventHandler = () =>
    props.setCurrent(props.count);

  /* ---------------------------------- Non-compact page buttons ---------------------------------- */

  // If the page count is less than the stated amount, render a button for each
  const minPagesForCompact = 4;

  /* ------------------------------------------ Component ----------------------------------------- */

  return (
    <div className="pagination btn-group">
      <button
        type="button"
        className="btn btn-secondary"
        disabled={firstButtonDisabled}
        onClick={handleFirstButtonClick}
      >
        <span className="sr-only">Load first page</span>
        <FontAwesomeIcon icon={faChevronsLeft} />
      </button>
      {props.count < minPagesForCompact ? <PageButtons {...props} /> : null}
      <button
        type="button"
        className="btn btn-secondary"
        disabled={lastButtonDisabled}
        onClick={handleLastButtonClick}
      >
        <span className="sr-only">Load last page</span>
        <FontAwesomeIcon icon={faChevronsRight} />
      </button>
    </div>
  );
};

export default Pagination;

/* ---------------------------------------------------------------------------------------------- */
/*                                       Non-compact buttons                                      */
/* ---------------------------------------------------------------------------------------------- */

const PageButtons: React.FC<PaginationProps> = (props) => {
  const buttons: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >[] = [];

  let i = 1;
  while (i <= props.count) {
    const btn: React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    > = (
      <button
        type="button"
        className="btn btn-secondary"
        disabled={i === props.current}
        onClick={() => props.setCurrent(i)}
      >
        <span className="sr-only">Load page {i}</span>
        <span aria-hidden={true}>{i}</span>
      </button>
    );
    buttons.push(btn);
    i++;
  }
  return <>{...buttons}</>;
};
