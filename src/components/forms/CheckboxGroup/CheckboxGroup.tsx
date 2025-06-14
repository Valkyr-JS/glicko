import React, { useState } from "react";
import { default as cx } from "classnames";
import formStyles from "../forms.module.scss";

interface CheckboxGroupProps extends React.PropsWithChildren {
  /** The unique group ID. */
  checkboxes: CheckboxProps[];
  /** The title for the group. */
  title?: string;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = (props) => {
  const headingClasses = cx("form-label", "col-form-label", formStyles.heading);

  return (
    <div className="form-group">
      {props.title ? <div className={headingClasses}>{props.title}</div> : null}
      {props.checkboxes.map((c, i) => (
        <Checkbox key={i} {...c} />
      ))}
      {props.children}
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
  /** Dictates whether the checkbox label should be displayed with heading
   * styles. Typically for a solo checkbox with no title. */
  labelAsHeading?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = (props) => {
  const [checked, toggleChecked] = useState(props.isChecked);

  const labelClasses = cx("form-check-label", "col-form-label", {
    [formStyles.heading]: props.labelAsHeading,
  });

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
      <label className={labelClasses} htmlFor={props.id}>
        {props.label}
      </label>
    </div>
  );
};
