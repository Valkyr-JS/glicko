import React, { useState } from "react";

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
        <h3>{props.label}</h3>
        <div className="sub-heading">{props.children}</div>
      </div>
      <div>
        <div className="custom-control custom-switch">
          <input
            checked={checked}
            className="custom-control-input"
            type="checkbox"
            id={props.id}
            name={props.name}
            onChange={() => toggleChecked(!checked)}
            value={checked + ""}
          />
          <label className="custom-control-label" htmlFor={props.id}></label>
        </div>
      </div>
    </div>
  );
};

export default FormToggle;
