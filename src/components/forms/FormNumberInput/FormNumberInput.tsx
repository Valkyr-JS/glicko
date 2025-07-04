import React, { useState } from "react";
import { default as cx } from "classnames";
import formStyles from "../forms.module.scss";

interface FormNumberInputProps extends React.PropsWithChildren {
  /** The unique input ID. */
  id: string;
  /** The initial value of the input. */
  initialValue: number;
  /** The label/heading for the input. */
  label: string;
  /** The property name for the input which appears in the response. */
  name: string;
  /** The maximum possible value of the input. */
  max?: number;
  /** The minimum possible value of the input. */
  min?: number;
  /** When `true`, the input can be disbaled/made optional with a toggle. */
  toggleable?: boolean;
}

const FormNumberInput: React.FC<FormNumberInputProps> = (props) => {
  const [value, setValue] = useState(props.initialValue);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const newValue = +e.target.value;
    setValue(newValue);
  };

  const inputClasses = cx("text-input", "form-control");

  return (
    <div className="setting">
      <div>
        <label
          className={formStyles.heading}
          id={props.id + "_label"}
          htmlFor={props.id}
        >
          {props.label}
        </label>
        <div className="sub-heading">{props.children}</div>
      </div>
      <div>
        <input
          aria-labelledby={props.id + "_label"}
          className={inputClasses}
          id={props.id}
          max={props.max}
          min={props.min}
          name={props.name}
          onChange={handleChange}
          type="number"
          value={value}
        />
      </div>
    </div>
  );
};

export default FormNumberInput;
