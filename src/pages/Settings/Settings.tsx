import React, { useRef, useState } from "react";
import { faHand } from "@fortawesome/pro-solid-svg-icons/faHand";
import { default as cx } from "classnames";
import Modal from "@/components/Modal/Modal";
import styles from "./Settings.module.scss";
import ReadOnlyMode from "./options/ReadOnlyMode";

interface SettingsPageProps extends PageProps {
  /** The user's game settings. */
  settings: UserSettings;
  /** The handler for updating the user settings. */
  saveSettingsHandler: (updatedFilters: PerformerFilters) => Promise<void>;
}

const SettingsPage: React.FC<SettingsPageProps> = (props) => {
  const formRef = useRef<HTMLFormElement>(null);

  const classes = cx("container", styles.Settings);

  /* --------------------------------------- General changes -------------------------------------- */

  const onFormChange: React.FormEventHandler<HTMLFormElement> = () => {
    if (!formRef.current) return props.setActivePage("HOME");

    const formData = new FormData(formRef.current);
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  };

  /* --------------------------------------- Cancel changes --------------------------------------- */

  const [showCancelModal, setShowCancelModal] = useState(false);

  /** Handler for clicking the cancel button at the bottom of the page. */
  const handleCancel: React.MouseEventHandler = () => {
    console.log("cancel");
  };

  /* ---------------------------------------- Save settings --------------------------------------- */

  /** Handler for clicking the form 'Save settings' button */
  const handleSaveSettings: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    // Save, then redirect to the homepage
    console.log("save");
  };

  /* ------------------------------------------ Component ----------------------------------------- */

  return (
    <>
      <main className={classes}>
        <form
          method="POST"
          onSubmit={handleSaveSettings}
          ref={formRef}
          onChange={onFormChange}
        >
          <h1>Settings</h1>
          <ReadOnlyMode enabled={props.settings.readOnly} />
          <div className={styles["button-container"]}>
            <button
              type="button"
              className="btn btn-secondary ml-auto"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </main>
      <Modal
        buttons={[
          {
            element: "button",
            children: "No",
            className: "btn btn-secondary",
            onClick: () => setShowCancelModal(false),
            type: "button",
          },
          {
            element: "button",
            className: "btn btn-danger",
            children: "Yes",
            onClick: () => props.setActivePage("HOME"),
            type: "button",
          },
        ]}
        icon={faHand}
        show={showCancelModal}
        title="Changes will not be saved"
      >
        <p>
          You have not saved your changes. Are you sure you want to leave
          without saving your changes?
        </p>
      </Modal>
    </>
  );
};

export default SettingsPage;
