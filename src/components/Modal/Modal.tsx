import React from "react";
import { default as cx } from "classnames";
import type { IconDefinition } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Modal.module.scss";

interface ModalProps extends React.PropsWithChildren {
  /** Buttons displayed in the modal footer. */
  buttons: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >[];
  /** The icon displayed in the top-left corner of the modal. */
  icon: IconDefinition;
  /** Whether the modal is currently being rendered. */
  show: boolean;
  /** Title string for the modal. */
  title: string;
}

const Modal: React.FC<ModalProps> = (props) => {
  const modalClasses = cx("fade", "modal", "show");
  const modalStyles = {
    display: "block",
  };
  const modalFooterClasses = cx("modal-footer", styles["button-container"]);

  if (!props.show) return null;
  return (
    <>
      <div className="modal-backdrop show" />
      <section
        role="dialog"
        aria-model
        className={modalClasses}
        style={modalStyles}
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <FontAwesomeIcon icon={props.icon} />
              <span>{props.title}</span>
            </div>
            <div className="modal-body">{props.children}</div>
            {props.buttons.length ? (
              <div className={modalFooterClasses}>
                {props.buttons.map((btn) => (
                  <button {...btn} />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
};

export default Modal;
