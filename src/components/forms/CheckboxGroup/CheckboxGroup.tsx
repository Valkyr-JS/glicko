import React from "react";

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
  /** The label text. */
  label: string;
  /** The value returned in the response */
  value: string;
}

const Checkbox: React.FC<CheckboxProps> = (props) => {
  return (
    <div className="form-check form-check-inline">
      <input
        className="form-check-input"
        type="checkbox"
        id={props.id}
        value={props.value}
      />
      <label className="form-check-label" htmlFor={props.id}>
        {props.label}
      </label>
    </div>
  );
};
