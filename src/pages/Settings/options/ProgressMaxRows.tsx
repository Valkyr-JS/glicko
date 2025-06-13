import NumberInput from "@/components/forms/NumberInput/NumberInput";
import React from "react";

interface ProgressMaxRowsProps {
  userMaxRows?: UserSettings["progressMaxRows"];
}

const ProgressMaxRows: React.FC<ProgressMaxRowsProps> = (props) => {
  return (
    <NumberInput
      id="progressMaxRows"
      initialValue={props.userMaxRows ?? 5}
      label="Maximum number of recent matches shown"
      name="progress-max-rows"
      min={1}
    />
  );
};

export default ProgressMaxRows;
