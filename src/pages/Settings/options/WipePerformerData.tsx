import Modal from "@/components/Modal/Modal";
import { faExclamationCircle } from "@fortawesome/pro-solid-svg-icons/faExclamationCircle";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons/faSpinnerThird";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

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
  closeHandler: () => void;
  /** Handler for confirming the wipe action. */
  confirmHandler: () => Promise<void>;
  /** Whether the modal is currently being rendered. */
  show: boolean;
}

export const WipePerformerDataModal: React.FC<WipePerformerDataModalProps> = (
  props
) => {
  const [isProcessing, setIsProcessing] = useState(false);

  /** Handle clicking the Yes button */
  const handleConfirm = async () => {
    setIsProcessing(true);
    await props.confirmHandler();
    setIsProcessing(false);
    props.closeHandler();
  };

  // Show a spinner while data is being wiped.
  const yesContent = isProcessing ? (
    <FontAwesomeIcon icon={faSpinnerThird} spin />
  ) : (
    "Yes"
  );

  return (
    <Modal
      buttons={[
        {
          element: "button",
          children: "No",
          className: "btn btn-secondary",
          disabled: isProcessing,
          onClick: props.closeHandler,
          type: "button",
        },
        {
          element: "button",
          children: yesContent,
          className: "btn btn-danger",
          disabled: isProcessing,
          onClick: handleConfirm,
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
