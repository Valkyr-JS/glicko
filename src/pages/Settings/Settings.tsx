import React, { useRef, useState } from "react";
import { faHand } from "@fortawesome/pro-solid-svg-icons/faHand";
import { default as cx } from "classnames";
import Modal from "@/components/Modal/Modal";
import WipePerformerData, {
  WipePerformerDataModal,
} from "./options/WipePerformerData";
import styles from "./Settings.module.scss";
import FormSection from "@/components/forms/FormSection/FormSection";
import FormToggle from "@/components/forms/FormToggle/FormToggle";
import FormNumberInput from "@/components/forms/FormNumberInput/FormNumberInput";
import {
  DEFAULT_BOARD_WIDTH,
  DEFAULT_MAX_PROGRESS_BOARD_ROWS,
} from "@/constants";

interface SettingsPageProps extends PageProps {
  /** The user's game settings. */
  settings: UserSettings;
  /** The handler for updating the user settings. */
  saveSettingsHandler: (
    updatedSettings: UserSettings
  ) => Promise<null | undefined>;
  /** The handler for wiping all Glicko data from all Stash performers */
  wipeDataHandler: () => Promise<null | undefined>;
}

const SettingsPage: React.FC<SettingsPageProps> = (props) => {
  const [settingsChanged, setSettingsChanged] = useState(false);
  const [showWipeDataModal, setShowWipeDataModal] = useState(false);

  // This state is for reference between form items, e.g. for the wipe performer
  // button to see the current read-only mode. It should not be used for
  // submission purposes.
  const [currentSettings, setCurrentSettings] = useState<UserSettings>(
    props.settings
  );

  const formRef = useRef<HTMLFormElement>(null);

  const classes = cx("container", styles.Settings);

  /* --------------------------------------- General changes -------------------------------------- */

  const onFormChange: React.FormEventHandler<HTMLFormElement> = () => {
    if (!formRef.current) return props.setActivePage("HOME");

    const formData = new FormData(formRef.current);
    const newSettings = convertFormDataToUserSettings(formData);
    const settingsHaveChanged = !compareSettings(props.settings, newSettings);
    setSettingsChanged(settingsHaveChanged);
    setCurrentSettings(newSettings);
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
          <FormSection heading="Game settings">
            <FormToggle
              id="readOnly"
              isActive={!!props.settings.readOnly}
              label='Enable "read-only" mode'
              name="read-only"
            >
              Read-only mode disables saving performer results to the Stash
              database. User settings and performer filters will still be saved
              to the Stash config.yml file as normal.
            </FormToggle>
            <FormToggle
              id="minimalHistory"
              isActive={!!props.settings.minimalHistory}
              label="Enable minimal match history"
              name="minimal-history"
            >
              When enabled, only the data for each performer's most recent match
              and two most recent sessions will be saved to their profile, as
              opposed to saving data for all matches and sessions. This may
              impact future planned features, but reduce loading times and the
              size of performers' custom data.
            </FormToggle>
            <FormToggle
              id="arrowKeys"
              isActive={!!props.settings.arrowKeys}
              label="Enable arrow keys"
              name="arrow-keys"
            >
              When enabled, the left and right arrow keys can be used to select
              performers in a matchup.
            </FormToggle>
            <FormToggle
              id="useThumbnails"
              isActive={!!props.settings.useThumbnails}
              label="Use thumbnail images"
              name="use-thumbnails"
            >
              When enabled, thumbnail-quality images are displayed instead of
              original-quality. This can reduce load time on slow networks,
              though they may need to be generated by Stash before showing up.
            </FormToggle>
            <FormNumberInput
              id="progressMaxRows"
              initialValue={
                props.settings.progressMaxRows ??
                DEFAULT_MAX_PROGRESS_BOARD_ROWS
              }
              label="Maximum number of recent matches shown"
              name="progress-max-rows"
              min={1}
            >
              This is the maximum number of previous matches that will be
              displayed at the bottom of the game screen.
            </FormNumberInput>
            <FormNumberInput
              id="boardWidth"
              initialValue={props.settings.boardWidth ?? DEFAULT_BOARD_WIDTH}
              label="Maximum game board width"
              name="board-width"
              max={DEFAULT_BOARD_WIDTH}
              min={320}
              toggleable
            >
              <p>
                If you find yourself needing to scroll up and down to see the
                whole game board, you can try reducing the size of the board for
                a better experience.
              </p>
              <p>
                This value is measured in pixels. The board cannot be increased
                beyond {DEFAULT_BOARD_WIDTH}px.
              </p>
            </FormNumberInput>
          </FormSection>
          <div className="row mt-3">
            <div className="col-12 col-lg-6">
              <WipePerformerData
                onClickHandler={() => setShowWipeDataModal(true)}
                readOnly={!!currentSettings.readOnly}
              />
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
      <WipePerformerDataModal
        closeHandler={() => setShowWipeDataModal(false)}
        confirmHandler={props.wipeDataHandler}
        show={showWipeDataModal}
      />
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

  // Minimal match history
  const minimalHistory = !!formKeys.find((k) => k === "minimal-history");

  // Use thumbnails
  const useThumbnails = !!formKeys.find((k) => k === "use-thumbnails");

  // Arrow-keys mode
  const arrowKeys = !!formKeys.find((k) => k === "arrow-keys");

  // Progress max rows
  const formProgressMaxRows = +formJson["progress-max-rows"];
  const progressMaxRows =
    formProgressMaxRows === DEFAULT_MAX_PROGRESS_BOARD_ROWS
      ? undefined
      : formProgressMaxRows;

  // Board width
  const formBoardWidth = +formJson["board-width"];
  const boardWidth =
    formBoardWidth === DEFAULT_BOARD_WIDTH ? undefined : formBoardWidth;

  const updatedSettings: UserSettings = {
    arrowKeys,
    boardWidth,
    useThumbnails,
    minimalHistory,
    progressMaxRows,
    readOnly,
  };

  return updatedSettings;
};

/** Compares two sets of user settings for equality. */
const compareSettings = (setA: UserSettings, setB: UserSettings): boolean => {
  if (setA.readOnly !== setB.readOnly) return false;
  if (setA.minimalHistory !== setB.minimalHistory) return false;
  if (setA.useThumbnails !== setB.useThumbnails) return false;
  if (setA.arrowKeys !== setB.arrowKeys) return false;
  if (setA.progressMaxRows !== setB.progressMaxRows) return false;
  if (setA.boardWidth !== setB.boardWidth) return false;

  return true;
};
