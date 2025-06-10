import React from "react";
import type { IconDefinition } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { default as cx } from "classnames";
import styles from "./Modal.module.scss";
import { faExclamationCircle } from "@fortawesome/pro-solid-svg-icons/faExclamationCircle";

type ButtonOrLinkProps =
  | ({ element: "button" } & React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >)
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
                  }
                  const { element, ...anchorProps } = el;
                  return <a key={element + i} {...anchorProps} />;
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

/* ---------------------------------------------------------------------------------------------- */
/*                                        Game error modal                                        */
/* ---------------------------------------------------------------------------------------------- */

interface GameErrorModalProps {
  /** Handler for closing the modal. */
  closeHandler: React.MouseEventHandler;
  /** Any kind of game error that stop the user from playing. */
  gameError: GameError | null;
  /** Dictates whether the modal is active. */
  show: boolean;
}

export const GameErrorModal: React.FC<GameErrorModalProps> = (props) => {
  return (
    <Modal
      buttons={[
        {
          element: "anchor",
          children: "Open issue on GitHub",
          className: "btn btn-secondary",
          target: "_blank",
          href:
            "https://github.com/Valkyr-JS/glicko/issues/new?title=[ Game%20error ]&labels=bug&body=**Please add any other relevant details before submitting.**%0D%0A%0D%0A%0D%0A%0D%0A---%0D%0A%0D%0AVersion " +
            __APP_VERSION__ +
            "%0D%0A%0D%0A```%0D%0A" +
            encodeURI(JSON.stringify(props.gameError?.details) ?? "No error") +
            "%0D%0A```",
        },
        {
          element: "button",
          children: "Close",
          className: "btn btn-primary",
          onClick: props.closeHandler,
          type: "button",
        },
      ]}
      icon={faExclamationCircle}
      show={props.show}
      title={props.gameError?.name ?? "No error name"}
    >
      <p>An error occured whilst attempting to fetch data from Stash.</p>
      <p>
        <code>{props.gameError?.message ?? "No error message"}</code>
      </p>
      <p>
        Please check your settings and retry. If you continue to run into this
        error, please raise an issue on GitHub using the button below.
      </p>
      {props.gameError?.details ? (
        <code>{JSON.stringify(props.gameError?.details) ?? "No error"}</code>
      ) : null}
    </Modal>
  );
};
