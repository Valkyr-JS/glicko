import React from "react";
import { default as cx } from "classnames";

interface FormSectionProps extends React.PropsWithChildren {
  /** The section heading, displayed above the section. */
  heading?: string;
}

const classes = cx("setting-section");

const FormSection: React.FC<FormSectionProps> = (props) => {
  const heading = props.heading ? (
    <h2>{props.heading}</h2>
  ) : null;

  return (
    <div className={classes}>
      {heading}
      <div className="card">{props.children}</div>
    </div>
  );
};

export default FormSection;
