import React, { useEffect, useRef, useState } from "react";
import { faHand } from "@fortawesome/pro-solid-svg-icons/faHand";
import { default as cx } from "classnames";
import CheckboxGroup from "@/components/forms/CheckboxGroup/CheckboxGroup";
import NumberInput from "@/components/forms/NumberInput/NumberInput";
import Modal from "@/components/Modal/Modal";
import { PATH } from "@/constants";
import type { PageProps, PlayerFilters } from "@/types/global";
import styles from "./Settings.module.scss";

interface SettingsPageProps extends PageProps {
  /** The current filters. */
  filters: PlayerFilters;
  /** Dictates whether a tournament is in progress. */
  inProgress: boolean;
  /** The handler for updating the tournament filters. */
  saveSettingsHandler: (updatedFilters: PlayerFilters) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({
  setActivePage,
  ...props
}) => {
  const [settingsChanged, setSettingsChanged] = useState(false);
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (shouldNavigate) setActivePage("HOME");
  }, [setActivePage, shouldNavigate]);

  const classes = cx("container", styles.Settings);

  /* --------------------------------------- General changes -------------------------------------- */

  const onFormChange: React.FormEventHandler<HTMLFormElement> = () => {
    if (!formRef.current) return setShouldNavigate(true);

    const formData = new FormData(formRef.current);
    const currentFilters = convertFormDataToPlayerFilters(formData);
    const filtersHaveChanged = !comparePlayerFilters(
      props.filters,
      currentFilters
    );

    setSettingsChanged(filtersHaveChanged);
  };

  /* -------------------------------------------- Limit ------------------------------------------- */

  // Only for getting the current value. Do not use to update the value or in
  // form submission.
  const [currentLimit, setCurrentLimit] = useState(props.filters.limit);
  const limitSoftMax = 25;
  const limitSoftMin = 15;

  /** Get the number of round-robin matches based on the number of players.  */
  const getLimitMatches = (p: number) => (p * (p - 1)) / 2;

  /* --------------------------------------- Cancel changes --------------------------------------- */

  const [showCancelModal, setShowCancelModal] = useState(false);

  /** Handler for clicking the cancel button at the bottom of the page. */
  const handleCancel: React.MouseEventHandler = () => {
    if (!formRef.current) return setShouldNavigate(true);
    if (settingsChanged) setShowCancelModal(true);
    else setShouldNavigate(true);
  };

  /* ---------------------------------------- Save settings --------------------------------------- */

  const [showInProgressModal, setShowInProgressModal] = useState(false);

  /** Save settings to the App control state. */
  const handleSaveToControl = () => {
    if (formRef.current) {
      // Process the form values
      const updatedFilters = convertFormDataToPlayerFilters(
        new FormData(formRef.current)
      );

      // Save settings to the App control state
      props.saveSettingsHandler(updatedFilters);
    }
  };

  /** Handler for clicking the form 'Save settings' button */
  const handleSaveSettings: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    // If there is a tournament in progress, render a modal.
    if (props.inProgress) return setShowInProgressModal(true);

    // Save, then redirect to the homepage
    handleSaveToControl();
    setShouldNavigate(true);
  };

  /** Handler for clicking the 'Continue' button in the modal for saving
   * settings whilst a tournament is in progress */
  const handleSaveSettingsInProgress: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    handleSaveToControl();
    setShouldNavigate(true);
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
          <h1>Tournament settings</h1>
          <NumberInput
            id="playerLimit"
            initialValue={props.filters.limit}
            label="Performer limit"
            name="player-limit"
            min={2}
            softMax={{
              value: limitSoftMax,
              warning: `Consider reducing the performer limit to ${limitSoftMax} or less.`,
            }}
            softMin={{
              value: limitSoftMin,
              warning: `Consider increasing the performer limit to ${limitSoftMin} or more.`,
            }}
            valueCallback={setCurrentLimit}
          >
            <small>
              <p className="mt-2">
                This is the maximum number of performers that will be pulled
                from your Stash library. Less than {limitSoftMin} performers may
                return inaccurate results. More than {limitSoftMax} performers
                may cause the tournament to take too long and potentially cause
                slowdown.
              </p>
              <p>
                {currentLimit} performers will generate a tournament of{" "}
                {getLimitMatches(currentLimit)} matches.
              </p>
            </small>
          </NumberInput>
          <CheckboxGroup
            title="Genders"
            checkboxes={[
              {
                isChecked: props.filters.genders?.includes("MALE") ?? false,
                id: "genderMale",
                label: "Male",
                name: "gender-male",
              },
              {
                isChecked: props.filters.genders?.includes("FEMALE") ?? false,
                id: "genderFemale",
                label: "Female",
                name: "gender-female",
              },
              {
                isChecked:
                  props.filters.genders?.includes("TRANSGENDER_MALE") ?? false,
                id: "genderTransgenderMale",
                label: "Transgender male",
                name: "gender-transgender_male",
              },
              {
                isChecked:
                  props.filters.genders?.includes("TRANSGENDER_FEMALE") ??
                  false,
                id: "genderTransgenderFemale",
                label: "Transgender Female",
                name: "gender-transgender_female",
              },
              {
                isChecked: props.filters.genders?.includes("INTERSEX") ?? false,
                id: "genderIntersex",
                label: "Intersex",
                name: "gender-intersex",
              },
              {
                isChecked:
                  props.filters.genders?.includes("NON_BINARY") ?? false,
                id: "genderNonBinary",
                label: "Non-Binary",
                name: "gender-non_binary",
              },
            ]}
          >
            <small>
              <p className="mt-2">
                Select all the genders that qualify for the tournament.
                Selecting none will qualify any gender.
              </p>
            </small>
          </CheckboxGroup>
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
            onClick: () => setShowInProgressModal(false),
            type: "button",
          },
          {
            element: "button",
            className: "btn btn-danger",
            children: "Yes",
            onClick: handleSaveSettingsInProgress,
            type: "button",
          },
        ]}
        icon={faHand}
        show={showInProgressModal}
        title="Tournament progress will be lost"
      >
        <p>
          A tournament is currently in progress. Changing your settings now will
          cause the tournament's progress to be lost. This cannot be undone.
        </p>
        <p>
          Are you sure you want to save your changes and lose all progress in
          the current tournament?
        </p>
      </Modal>
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
            element: "link",
            className: "btn btn-danger",
            children: "Yes",
            type: "button",
            to: PATH.HOME,
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

/* ---------------------------------------------------------------------------------------------- */
/*                                            Functions                                           */
/* ---------------------------------------------------------------------------------------------- */

/** Convert data from the settings form into PlayerFilters data. */
const convertFormDataToPlayerFilters = (data: FormData): PlayerFilters => {
  const formJson = Object.fromEntries(data.entries());

  const genders = Object.keys(formJson)
    .filter((p) => p.match("gender-"))
    .map((p) => p.split("gender-")[1].toUpperCase());

  const updatedFilters: PlayerFilters = {
    genders: genders as PlayerFilters["genders"],
    limit: +formJson["player-limit"],
  };

  return updatedFilters;
};

/** Compares two sets of player filters for equality. */
const comparePlayerFilters = (
  setA: PlayerFilters,
  setB: PlayerFilters
): boolean => {
  // Genders
  const setAGenders = JSON.stringify(setA.genders.sort());
  const setBGenders = JSON.stringify(setB.genders.sort());

  if (setAGenders !== setBGenders) return false;

  // Limit
  if (setA.limit !== setB.limit) return false;

  return true;
};
