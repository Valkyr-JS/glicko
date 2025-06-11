import React, { useState } from "react";
import { default as cx } from "classnames";
import formStyles from "../forms.module.scss";

interface RadioGroupProps extends React.PropsWithChildren {
  /** The unique group ID. */
  radios: Omit<RadioProps, "name" | "onChangeHandler">[];
  /** The name of the radio group as it will appear in the submitted data. */
  name: string;
  /** The title for the group. */
  title: string;
}

const RadioGroup: React.FC<RadioGroupProps> = (props) => {
  const headingClasses = cx("form-label", "col-form-label", formStyles.heading);
  const [checked, setChecked] = useState<string | null>(
    props.radios.find((r) => r.isChecked)?.value ?? null
  );

  return (
    <div className="form-group">
      <div className={headingClasses}>{props.title}</div>
      {props.radios.map((r, i) => (
        <Radio
          key={i}
          {...r}
          isChecked={checked === r.value}
          name={props.name}
          onChangeHandler={() => setChecked(r.value)}
        />
      ))}
      {props.children}
    </div>
  );
};

export default RadioGroup;

/* ---------------------------------------------------------------------------------------------- */
/*                                       Checkbox component                                       */
/* ---------------------------------------------------------------------------------------------- */

interface RadioProps {
  /** The unique radio ID. */
  id: string;
  /** The initial checked state of the radio */
  isChecked: boolean;
  /** The label text. */
  label: string;
  /** The name of the radio group as it will appear in the submitted data. */
  name: string;
  /** The radio button on change handler. */
  onChangeHandler: React.ChangeEventHandler<HTMLInputElement>;
  /** The value of the radio button as it will appear in the submitted data if
   * checked. */
  value: string;
}

const Radio: React.FC<RadioProps> = (props) => {
  return (
    <div className="form-check form-check-inline">
      <input
        checked={props.isChecked}
        className="form-check-input"
        type="radio"
        id={props.id}
        name={props.name}
        onChange={props.onChangeHandler}
        value={props.value}
      />
      <label className="form-check-label" htmlFor={props.id}>
        {props.label}
      </label>
    </div>
  );
};
