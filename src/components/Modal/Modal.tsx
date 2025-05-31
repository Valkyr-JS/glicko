import React from "react";
import { default as cx } from "classnames";

interface ModalProps extends React.PropsWithChildren {
  buttons: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >[];
  closeModalHandler: () => void;
  show: boolean;
  title: string;
}

const Modal: React.FC<ModalProps> = (props) => {
  const modalClasses = cx("modal", "show");
  const modalStyles = {
    display: "block",
  };

  if (!props.show) return null;
  return (
    <>
      <div className="modal-backdrop show" />
      <section className={modalClasses} style={modalStyles} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{props.title}</h5>
            </div>
            <div className="modal-body">{props.children}</div>
            {props.buttons.length ? (
              <div className="modal-footer">
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
