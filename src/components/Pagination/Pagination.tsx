import { faChevronsLeft } from "@fortawesome/pro-solid-svg-icons/faChevronsLeft";
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
    </div>
  );
};

export default Pagination;
