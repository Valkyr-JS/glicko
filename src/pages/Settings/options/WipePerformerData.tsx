import Modal from "@/components/Modal/Modal";
import { faExclamationCircle } from "@fortawesome/pro-solid-svg-icons/faExclamationCircle";
import React from "react";

interface WipePerformerDataProps {
  onClickHandler: React.MouseEventHandler<HTMLButtonElement>;
}

const WipePerformerData: React.FC<WipePerformerDataProps> = (props) => {
  return (
    <button
      type="button"
      className="btn btn-danger"
      onClick={props.onClickHandler}
    >
      Wipe performer data
    </button>
  );
};

export default WipePerformerData;

/* ---------------------------------------------------------------------------------------------- */
/*                                              Modal                                             */
/* ---------------------------------------------------------------------------------------------- */

interface WipePerformerDataModalProps {
  /** Handler for closing the modal. */
  closeHandler: React.MouseEventHandler;
  /** Handler for confirming the wipe action. */
  confirmHandler: React.MouseEventHandler;
  /** Whether the modal is currently being rendered. */
  show: boolean;
}

export const WipePerformerDataModal: React.FC<WipePerformerDataModalProps> = (
  props
) => {
  return (
    <Modal
      buttons={[
        {
          element: "button",
          children: "No",
          className: "btn btn-secondary",
          onClick: props.closeHandler,
          type: "button",
        },
        {
          element: "button",
          className: "btn btn-danger",
          children: "Yes",
          onClick: props.confirmHandler,
          type: "button",
        },
      ]}
      icon={faExclamationCircle}
      show={props.show}
      title="Wipe performer data"
    >
      <p>
        Wiping performer data will remove all Glicko-related data from all
        performers in your library. This cannot be undone.
      </p>
      <p>Are you sure you want to wipe all performer data?</p>
    </Modal>
  );
};
