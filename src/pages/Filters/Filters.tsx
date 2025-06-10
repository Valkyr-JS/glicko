import React, { useRef, useState } from "react";
import { faHand } from "@fortawesome/pro-solid-svg-icons/faHand";
import { default as cx } from "classnames";
import CheckboxGroup from "@/components/forms/CheckboxGroup/CheckboxGroup";
import Modal from "@/components/Modal/Modal";
import styles from "./Filters.module.scss";

interface FiltersPageProps extends PageProps {
  /** The current performer filters. */
  filters: PerformerFilters;
  /** The handler for updating the performer filters. */
  saveFiltersHandler: (updatedFilters: PerformerFilters) => void;
  /** The user's Stash config data */
  stashConfig?: StashConfigResult;
}

const FiltersPage: React.FC<FiltersPageProps> = (props) => {
  const [filtersChanged, setFiltersChanged] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const classes = cx("container", styles.Filters);

  console.log(props.stashConfig);

  /* --------------------------------------- General changes -------------------------------------- */

  const onFormChange: React.FormEventHandler<HTMLFormElement> = () => {
    if (!formRef.current) return props.setActivePage("HOME");

    const formData = new FormData(formRef.current);
    const currentFilters = convertFormDataToPlayerFilters(formData);
    const filtersHaveChanged = !comparePlayerFilters(
      props.filters,
      currentFilters
    );

    setFiltersChanged(filtersHaveChanged);
  };

  /* --------------------------------------- Cancel changes --------------------------------------- */

  const [showCancelModal, setShowCancelModal] = useState(false);

  /** Handler for clicking the cancel button at the bottom of the page. */
  const handleCancel: React.MouseEventHandler = () => {
    if (!formRef.current) return props.setActivePage("HOME");
    if (filtersChanged) setShowCancelModal(true);
    else props.setActivePage("HOME");
  };

  /* ---------------------------------------- Save settings --------------------------------------- */

  /** Save settings to the App control state. */
  const handleSaveToControl = () => {
    if (formRef.current) {
      // Process the form values
      const updatedFilters = convertFormDataToPlayerFilters(
        new FormData(formRef.current)
      );

      // Save settings to the App control state
      props.saveFiltersHandler(updatedFilters);
    }
  };

  /** Handler for clicking the form 'Save settings' button */
  const handleSaveSettings: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    // Save, then redirect to the homepage
    handleSaveToControl();
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
          <h1>Performer filters</h1>
          <CheckboxGroup
            title="Genders"
            checkboxes={[
              {
                isChecked: props.filters.genders.includes("MALE") ?? false,
                id: "genderMale",
                label: "Male",
                name: "gender-male",
              },
              {
                isChecked: props.filters.genders.includes("FEMALE") ?? false,
                id: "genderFemale",
                label: "Female",
                name: "gender-female",
              },
              {
                isChecked:
                  props.filters.genders.includes("TRANSGENDER_MALE") ?? false,
                id: "genderTransgenderMale",
                label: "Transgender male",
                name: "gender-transgender_male",
              },
              {
                isChecked:
                  props.filters.genders.includes("TRANSGENDER_FEMALE") ?? false,
                id: "genderTransgenderFemale",
                label: "Transgender Female",
                name: "gender-transgender_female",
              },
              {
                isChecked: props.filters.genders.includes("INTERSEX") ?? false,
                id: "genderIntersex",
                label: "Intersex",
                name: "gender-intersex",
              },
              {
                isChecked:
                  props.filters.genders.includes("NON_BINARY") ?? false,
                id: "genderNonBinary",
                label: "Non-Binary",
                name: "gender-non_binary",
              },
            ]}
          >
            <small>
              <p className="mt-2">
                Select all the genders that qualify for the game. Selecting none
                will qualify any gender.
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
              disabled={!filtersChanged}
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

export default FiltersPage;

/* ---------------------------------------------------------------------------------------------- */
/*                                            Functions                                           */
/* ---------------------------------------------------------------------------------------------- */

/** Convert data from the settings form into PlayerFilters data. */
const convertFormDataToPlayerFilters = (data: FormData): PerformerFilters => {
  const formJson = Object.fromEntries(data.entries());

  const genders = Object.keys(formJson)
    .filter((p) => p.match("gender-"))
    .map((p) => p.split("gender-")[1].toUpperCase());

  const updatedFilters: PerformerFilters = {
    genders: genders as PerformerFilters["genders"],
  };

  return updatedFilters;
};

/** Compares two sets of player filters for equality. */
const comparePlayerFilters = (
  setA: PerformerFilters,
  setB: PerformerFilters
): boolean => {
  // Genders
  const setAGenders = JSON.stringify(setA.genders.sort());
  const setBGenders = JSON.stringify(setB.genders.sort());

  if (setAGenders !== setBGenders) return false;

  return true;
};
