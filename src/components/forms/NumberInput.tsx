import React from "react";

interface NumberInputProps {
  value: number;
}

const NumberInput: React.FC<NumberInputProps> = (props) => {
  return <div>{props.value}</div>;
};

export default NumberInput;
