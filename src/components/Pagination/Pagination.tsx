import React from "react";

interface PaginationProps {
  /** The total number of pages. */
  count: number;
  /** The current page number */
  current: number;
}

const Pagination: React.FC<PaginationProps> = (props) => {
  console.log(props);
  return <div>Pagination</div>;
};

export default Pagination;
