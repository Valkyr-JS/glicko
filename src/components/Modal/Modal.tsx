import React from "react";
import type { IconDefinition } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { default as cx } from "classnames";
import styles from "./Modal.module.scss";
import { Link, type LinkProps } from "react-router";

type ButtonOrLinkProps =
  | ({ element: "button" } & React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >)
  | ({ element: "link" } & LinkProps)
  | ({ element: "anchor" } & React.DetailedHTMLProps<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      HTMLAnchorElement
    >);

interface ModalProps extends React.PropsWithChildren {
  /** Buttons displayed in the modal footer. */
  buttons: ButtonOrLinkProps[];
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
        aria-labelledby="modalTitle"
        aria-modal
        className={modalClasses}
        role="dialog"
        style={modalStyles}
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <FontAwesomeIcon icon={props.icon} />
              <span id="modalTitle">{props.title}</span>
            </div>
            <div className="modal-body">{props.children}</div>
            {props.buttons.length ? (
              <div className={modalFooterClasses}>
                {props.buttons.map((el, i) => {
                  if (el.element === "button") {
                    const { element, ...btnProps } = el;
                    return <button key={element + i} {...btnProps} />;
                  } else if (el.element === "anchor") {
                    const { element, ...anchorProps } = el;
                    return <a key={element + i} {...anchorProps} />;
                  }
                  const { element, ...linkProps } = el;
                  return <Link key={element + i} {...linkProps} />;
                })}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
};

export default Modal;
