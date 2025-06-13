import React, { useRef, useState } from "react";
import { faHand } from "@fortawesome/pro-solid-svg-icons/faHand";
import { default as cx } from "classnames";
import Modal from "@/components/Modal/Modal";
import styles from "./Settings.module.scss";
import ReadOnlyMode from "./options/ReadOnlyMode";
import ProgressMaxRows from "./options/ProgressMaxRows";

interface SettingsPageProps extends PageProps {
  /** The user's game settings. */
  settings: UserSettings;
  /** The handler for updating the user settings. */
  saveSettingsHandler: (updatedSettings: UserSettings) => Promise<void>;
}

const SettingsPage: React.FC<SettingsPageProps> = (props) => {
  const [settingsChanged, setSettingsChanged] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const classes = cx("container", styles.Settings);

  /* --------------------------------------- General changes -------------------------------------- */

  const onFormChange: React.FormEventHandler<HTMLFormElement> = () => {
    if (!formRef.current) return props.setActivePage("HOME");

    const formData = new FormData(formRef.current);
    const currentSettings = convertFormDataToUserSettings(formData);
    const settingsHaveChanged = !compareSettings(
      props.settings,
      currentSettings
    );
    setSettingsChanged(settingsHaveChanged);
  };

  /* --------------------------------------- Cancel changes --------------------------------------- */

  const [showCancelModal, setShowCancelModal] = useState(false);

  /** Handler for clicking the cancel button at the bottom of the page. */
  const handleCancel: React.MouseEventHandler = () => {
    if (!formRef.current) return props.setActivePage("HOME");
    if (settingsChanged) setShowCancelModal(true);
    else props.setActivePage("HOME");
  };

  /* ---------------------------------------- Save settings --------------------------------------- */

  /** Handler for clicking the form 'Save settings' button */
  const handleSaveSettings: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    // Save, then redirect to the homepage
    if (formRef.current) {
      // Process the form values
      const updatedFilters = convertFormDataToUserSettings(
        new FormData(formRef.current)
      );

      // Save settings to the App control state
      props.saveSettingsHandler(updatedFilters);
    }

    props.setActivePage("HOME");
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
          <div className="row">
            <div className="col-12">
              <ReadOnlyMode enabled={props.settings.readOnly} />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <ProgressMaxRows userMaxRows={props.settings.progressMaxRows} />
            </div>
          </div>
          <div className={styles["button-container"]}>
            <button
              type="button"
              className="btn btn-secondary ml-auto"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!settingsChanged}
            >
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

const convertFormDataToUserSettings = (data: FormData): UserSettings => {
  const formJson = Object.fromEntries(data.entries());
  const formKeys = Object.keys(formJson);

  // Read-only mode
  const readOnly = !!formKeys.find((k) => k === "read-only");

  // Progress max rows
  const progressMaxRows = +formJson["progress-max-rows"];

  const updatedSettings: UserSettings = {
    progressMaxRows,
    readOnly,
  };

  return updatedSettings;
};

/** Compares two sets of user settings for equality. */
const compareSettings = (setA: UserSettings, setB: UserSettings): boolean => {
  if (setA.readOnly !== setB.readOnly) return false;
  if (setA.progressMaxRows !== setB.progressMaxRows) return false;

  return true;
};
