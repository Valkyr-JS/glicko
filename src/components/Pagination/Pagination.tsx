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
