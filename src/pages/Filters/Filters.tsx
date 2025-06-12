import React, { useRef, useState } from "react";
import { faHand } from "@fortawesome/pro-solid-svg-icons/faHand";
import { default as cx } from "classnames";
import Modal from "@/components/Modal/Modal";
import styles from "./Filters.module.scss";
import StashEndpointFilter from "./StashEndpoint/StashEndpoint";
import GenderFilter from "./Genders/Genders";

interface FiltersPageProps extends PageProps {
  /** The current performer filters. */
  filters: PerformerFilters;
  /** The handler for updating the performer filters. */
  saveFiltersToConfigHandler: (
    updatedFilters: PerformerFilters
  ) => Promise<void>;
  /** The handler for updating the performer filters. */
  saveFiltersStateHandler: (updatedFilters: PerformerFilters) => void;
  /** The user's Stash config data */
  stashConfig?: StashConfigResult;
}

const FiltersPage: React.FC<FiltersPageProps> = (props) => {
  const [localFilter, setLocalFilter] = useState(props.filters);
  const [filtersChanged, setFiltersChanged] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const classes = cx("container", styles.Filters);

  /* --------------------------------------- General changes -------------------------------------- */

  const onFormChange: React.FormEventHandler<HTMLFormElement> = () => {
    if (!formRef.current) return props.setActivePage("HOME");

    const formData = new FormData(formRef.current);
    const currentFilters = convertFormDataToPerformerFilters(formData);
    const filtersHaveChanged = !comparePerformerFilters(
      props.filters,
      currentFilters
    );

    setLocalFilter(currentFilters);
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
      const updatedFilters = convertFormDataToPerformerFilters(
        new FormData(formRef.current)
      );

      // Save settings to the App control state
      props.saveFiltersStateHandler(updatedFilters);
    }
  };

  /** Handler for clicking the form 'Save settings' button */
  const handleSaveSettings: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    // Save, then redirect to the homepage
    handleSaveToControl();
    props.setActivePage("HOME");
  };

  const handleSaveAsDefault: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    props
      .saveFiltersToConfigHandler(localFilter)
      .then(() => props.setActivePage("HOME"));
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
          <GenderFilter genderFilter={props.filters.genders} />
          <StashEndpointFilter
            endpointFilter={props.filters.endpoint}
            stashConfig={props.stashConfig}
          />
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
              className="btn btn-secondary"
              disabled={!filtersChanged}
              onClick={handleSaveAsDefault}
            >
              Save as default
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

/** Convert data from the settings form into PerformerFilters data. */
const convertFormDataToPerformerFilters = (
  data: FormData
): PerformerFilters => {
  const formJson = Object.fromEntries(data.entries());
  const formKeys = Object.keys(formJson);

  // Genders
  const genders = formKeys
    .filter((p) => p.match("gender-"))
    .map((p) => p.split("gender-")[1].toUpperCase());

  // Stash box endpoints
  let endpoint: PerformerFilters["endpoint"] = undefined;
  switch (formJson.endpoint) {
    case "IS_NULL":
      endpoint = { modifier: "IS_NULL" };
      break;
    case "NOT_NULL":
      endpoint = { modifier: "NOT_NULL" };
      break;
    case "undefined":
      break;
    default:
      endpoint = {
        modifier: "INCLUDES",
        endpoint: formJson.endpoint?.toString(),
      };
      break;
  }

  const updatedFilters: PerformerFilters = {
    genders: genders as PerformerFilters["genders"],
    endpoint,
  };

  return updatedFilters;
};

/** Compares two sets of player filters for equality. */
const comparePerformerFilters = (
  setA: PerformerFilters,
  setB: PerformerFilters
): boolean => {
  // Genders
  const setAGenders = JSON.stringify(setA.genders.sort());
  const setBGenders = JSON.stringify(setB.genders.sort());

  if (setAGenders !== setBGenders) return false;

  // Stash box endpoints
  const setAEndpoint = JSON.stringify(setA.endpoint);
  const setBEndpoint = JSON.stringify(setB.endpoint);

  if (setAEndpoint !== setBEndpoint) return false;

  return true;
};
