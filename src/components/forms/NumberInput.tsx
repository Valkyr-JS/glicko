import React, { useState } from "react";

interface NumberInputProps {
  /** The unique input ID. */
  id: string;
  /** The initial value of the input. */
  initialValue: number;
  /** The label text. */
  label: string;
  /** The property name for the input which appears in the response. */
  name: string;
}

const NumberInput: React.FC<NumberInputProps> = (props) => {
  const [value, setValue] = useState(props.initialValue);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    setValue(+e.target.value);

  return (
    <div className="form-group">
      <label htmlFor={props.id} className="form-label col-form-label">
        {props.label}
      </label>
      <input
        type="number"
        className="text-input form-control"
        id={props.id}
        name={props.name}
        onChange={handleChange}
        value={value}
      />
    </div>
  );
};

export default NumberInput;
