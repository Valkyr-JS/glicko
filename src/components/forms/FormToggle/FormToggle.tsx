import React, { useState } from "react";
import formStyles from "../forms.module.scss";

interface FormToggleProps extends React.PropsWithChildren {
  /** The unique toggle ID. */
  id: string;
  /** The initial checked state of the toggle. */
  isActive: boolean;
  /** The label/heading for the toggle. */
  label: string;
  /** The property name for the input which appears in the response. */
  name: string;
}

const FormToggle: React.FC<FormToggleProps> = (props) => {
  const [checked, toggleChecked] = useState(props.isActive);

  return (
    <div className="setting">
      <div>
        <div id={props.id + "_label"} className={formStyles.heading}>
          {props.label}
        </div>
        <div className="sub-heading">{props.children}</div>
      </div>
      <div>
        <div className="custom-control custom-switch">
          <input
            aria-labelledby={props.id + "_label"}
            checked={checked}
            className="custom-control-input"
            type="checkbox"
            id={props.id}
            name={props.name}
            onChange={() => toggleChecked(!checked)}
            value={checked + ""}
          />
          <label className="custom-control-label" htmlFor={props.id} />
        </div>
      </div>
    </div>
  );
};

export default FormToggle;

interface OnlyToggleProps {
  /** The unique toggle ID. */
  id: string;
  /** The initial checked state of the toggle. */
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
}

export const OnlyToggle: React.FC<OnlyToggleProps> = (props) => {
  console.log("isActive", props.isActive);
  return (
    <div className="custom-control custom-switch">
      <input
        aria-labelledby={props.id + "_label"}
        checked={props.isActive}
        className="custom-control-input"
        type="checkbox"
        id={props.id}
        onChange={() => props.setIsActive(!props.isActive)}
      />
      <label className="custom-control-label" htmlFor={props.id} />
    </div>
  );
};
