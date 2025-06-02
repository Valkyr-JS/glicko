import React, { useState } from "react";

interface CheckboxGroupProps extends React.PropsWithChildren {
  /** The unique group ID. */
  checkboxes: CheckboxProps[];
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = (props) => {
  return (
    <div className="form-group">
      {props.checkboxes.map((c, i) => (
        <Checkbox key={i} {...c} />
      ))}
    </div>
  );
};

export default CheckboxGroup;

/* ---------------------------------------------------------------------------------------------- */
/*                                       Checkbox component                                       */
/* ---------------------------------------------------------------------------------------------- */

interface CheckboxProps {
  /** The unique checkbox ID. */
  id: string;
  /** The initial checked state of the checkbox */
  isChecked: boolean;
  /** The label text. */
  label: string;
  /** The property name for the input which appears in the response. */
  name: string;
}

const Checkbox: React.FC<CheckboxProps> = (props) => {
  const [checked, toggleChecked] = useState(props.isChecked);
  return (
    <div className="form-check form-check-inline">
      <input
        checked={checked}
        className="form-check-input"
        type="checkbox"
        id={props.id}
        name={props.name}
        onChange={() => toggleChecked(!checked)}
        value={checked + ""}
      />
      <label className="form-check-label" htmlFor={props.id}>
        {props.label}
      </label>
    </div>
  );
};
