import React, { useState } from "react";
import { default as cx } from "classnames";
import formStyles from "../forms.module.scss";

interface NumberInputProps extends React.PropsWithChildren {
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
  valueCallback?: (val: number) => void;
}

const NumberInput: React.FC<NumberInputProps> = (props) => {
  const [value, setValue] = useState(props.initialValue);

  const labelClasses = cx("form-label", "col-form-label", formStyles.heading);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const newValue = +e.target.value;
    setValue(newValue);
    if (props.valueCallback) props.valueCallback(newValue);
  };

  // Soft maximum warning
  const softMaxWarning =
    props.softMax && value > props.softMax.value ? (
      <div role="status" className="invalid-feedback">
        {props.softMax.warning}
      </div>
    ) : null;

  // Soft minimum warning
  const softMinWarning =
    props.softMin && value < props.softMin.value ? (
      <div role="status" className="invalid-feedback">
        {props.softMin.warning}
      </div>
    ) : null;

  return (
    <div className="form-group">
      <label htmlFor={props.id} className={labelClasses}>
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
      {softMaxWarning}
      {props.children}
    </div>
  );
};

export default NumberInput;
