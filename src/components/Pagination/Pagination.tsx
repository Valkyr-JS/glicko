import React, { useEffect, useState } from "react";
import { faChevronLeft } from "@fortawesome/pro-solid-svg-icons/faChevronLeft";
import { faChevronRight } from "@fortawesome/pro-solid-svg-icons/faChevronRight";
import { faChevronsLeft } from "@fortawesome/pro-solid-svg-icons/faChevronsLeft";
import { faChevronsRight } from "@fortawesome/pro-solid-svg-icons/faChevronsRight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { default as cx } from "classnames";
import styles from "./Pagination.module.scss";
import { faCheck } from "@fortawesome/pro-solid-svg-icons/faCheck";

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

  // If the page count is less than the stated amount, render a button for each
  const minPagesForCompact = 4;

  const classes = cx("pagination", "btn-group", styles.pagination)

  return (
    <div className={classes}>
      <button
        type="button"
        className="btn btn-secondary"
        disabled={firstButtonDisabled}
        onClick={handleFirstButtonClick}
      >
        <span className="sr-only">Load first page</span>
        <FontAwesomeIcon icon={faChevronsLeft} />
      </button>
      {props.count < minPagesForCompact ? (
        <PageButtons {...props} />
      ) : (
        <CompactButtons {...props} />
      )}
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

  for (let i = 1; i <= props.count; i++) {
    const btn: React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    > = (
      <button
        type="button"
        className="btn btn-secondary"
        disabled={i === props.current}
        onClick={() => {
          console.log("click", i);
          props.setCurrent(i);
        }}
      >
        <span className="sr-only">Load page {i}</span>
        <span aria-hidden={true}>{i}</span>
      </button>
    );
    buttons.push(btn);
  }
  return <>{...buttons}</>;
};

const CompactButtons: React.FC<PaginationProps> = (props) => {
  const [selectorActive, setSelectorActive] = useState(false);
  const [selection, setSelection] = useState(props.current);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setSelection(props.current);
  }, [props]);

  const prevButtonDisabled = props.current === 1;
  const handlePrevButtonClick: React.MouseEventHandler = () =>
    props.setCurrent(props.current - 1);

  const nextButtonDisabled = props.current === props.count;
  const handleNextButtonClick: React.MouseEventHandler = () =>
    props.setCurrent(props.current + 1);

  /** Handler for clicking the set page button to open up the input */
  const handleClickSelector: React.MouseEventHandler = () =>
    setSelectorActive(!selectorActive);

  /** Handler for changing the set page input value. */
  const handleChangePageInput: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const val = +e.target.value;

    // Update the input value, even if it's invalid
    setSelection(val);

    // Validate the input value, so the confirm button will be disabled if the
    // check fails
    setIsValid(!(val < 1 || val > props.count));
  };

  /** Handler for clicking the set page input confirm button */
  const handleClickConfirmPage: React.MouseEventHandler = () => {
    // Update the current page
    props.setCurrent(selection);

    // Hide the input
    setSelectorActive(false);
  };

  const inputGroupClasses = cx("input-group", styles["page-input"]);

  return (
    <>
      <button
        type="button"
        className="btn btn-secondary"
        disabled={prevButtonDisabled}
        onClick={handlePrevButtonClick}
      >
        <span className="sr-only">Load previous page</span>
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={handleClickSelector}
      >
        <span className="sr-only">Select page. Currently on page</span>
        {props.current} of {props.count}
      </button>
      {selectorActive ? (
        <span className={inputGroupClasses}>
          <input
            type="number"
            aria-labelledby="pagination-set-page"
            className="text-input form-control"
            min={1}
            max={props.count}
            name="set-page"
            onChange={handleChangePageInput}
            value={selection}
          />
          <span id="pagination-set-page" className="sr-only">
            Set the page
          </span>
          <div className="input-group-append">
            <button
              type="button"
              className="btn btn-primary"
              disabled={!isValid}
              onClick={handleClickConfirmPage}
            >
              <span className="sr-only">Confirm page</span>
              <FontAwesomeIcon icon={faCheck} />
            </button>
          </div>
        </span>
      ) : null}
      <button
        type="button"
        className="btn btn-secondary"
        disabled={nextButtonDisabled}
        onClick={handleNextButtonClick}
      >
        <span className="sr-only">Load next page</span>
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </>
  );
};
