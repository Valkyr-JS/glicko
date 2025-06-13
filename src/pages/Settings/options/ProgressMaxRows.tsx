import NumberInput from "@/components/forms/NumberInput/NumberInput";
import { DEFAULT_MAX_PROGRESS_BOARD_ROWS } from "@/constants";
import React from "react";

interface ProgressMaxRowsProps {
  userMaxRows?: UserSettings["progressMaxRows"];
}

const ProgressMaxRows: React.FC<ProgressMaxRowsProps> = (props) => {
  return (
    <NumberInput
      id="progressMaxRows"
      initialValue={props.userMaxRows ?? DEFAULT_MAX_PROGRESS_BOARD_ROWS}
      label="Maximum number of recent matches shown"
      name="progress-max-rows"
      min={1}
    />
  );
};

export default ProgressMaxRows;
