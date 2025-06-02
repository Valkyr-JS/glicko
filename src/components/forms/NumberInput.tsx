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
  /** The maximum possible value of the input. */
  max?: number;
  /** The minimum possible value of the input. */
  min?: number;
  /** When entering a value over the soft max, a warning will be triggered. */
  softMax?: {
    value: number;
    warning: string;
  };
  /** When entering a value under the soft max, a warning will be triggered. */
  softMin?: {
    value: number;
    warning: string;
  };
}

const NumberInput: React.FC<NumberInputProps> = (props) => {
  const [value, setValue] = useState(props.initialValue);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    setValue(+e.target.value);

  // Soft minimum warning
  const softMinWarning =
    props.softMin && value < props.softMin.value ? (
      <div role="status" className="invalid-feedback">
        {props.softMin.warning}
      </div>
    ) : null;

  return (
    <div className="form-group">
      <label htmlFor={props.id} className="form-label col-form-label">
        {props.label}
      </label>
      <input
        type="number"
        className="text-input form-control"
        id={props.id}
        max={props.max}
        min={props.min}
        name={props.name}
        onChange={handleChange}
        value={value}
      />
      {softMinWarning}
    </div>
  );
};

export default NumberInput;
