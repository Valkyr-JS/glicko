import React, { useEffect, useState } from "react";
import { default as cx } from "classnames";
import styles from "./Settings.module.scss";
import type { GendersEnum, PlayerFilters } from "@/types/global";
import NumberInput from "@/components/forms/NumberInput/NumberInput";
import CheckboxGroup from "@/components/forms/CheckboxGroup/CheckboxGroup";
import { useNavigate } from "react-router";
import { PATH } from "@/constants";

interface SettingsPageProps {
  /** The current filters. */
  filters: PlayerFilters;
  /** Dictates whether a tournament is in progress. */
  inProgress: boolean;
  /** The handler for updating the tournament filters. */
  saveSettingsHandler: (updatedFilters: PlayerFilters) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = (props) => {
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (shouldNavigate) navigate(PATH.HOME);
  }, [shouldNavigate, navigate]);

  const classes = cx("container", styles.Settings);

  /* -------------------------------------------- Limit ------------------------------------------- */

  const fallbackLimit = 20;

  // Only for getting the current value. Do not use to update the value or in
  // form submission.
  const [currentLimit, setCurrentLimit] = useState(
    props.filters.limit ?? fallbackLimit
  );
  const limitSoftMax = 25;
  const limitSoftMin = 15;

  /** Get the number of round-robin matches based on the number of players.  */
  const getLimitMatches = (p: number) => (p * (p - 1)) / 2;

  /* ---------------------------------------- Save settings --------------------------------------- */

  const handleSaveSettings: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    // Process the form values
    const formData = new FormData(e.target as HTMLFormElement);
    const formJson = Object.fromEntries(formData.entries());

    const genders = Object.keys(formJson)
      .filter((p) => p.match("gender-"))
      .map((p) => p.split("gender-")[1].toUpperCase());

    const updatedFilters = {
      genders: genders as unknown as GendersEnum[],
      limit: +formJson["player-limit"],
    };

    props.saveSettingsHandler(updatedFilters);

    // Redirect to the homepage
    setShouldNavigate(true);
  };

  /* ------------------------------------------ Component ----------------------------------------- */

  return (
    <main className={classes}>
      <form method="POST" onSubmit={handleSaveSettings}>
        <h1>Tournament settings</h1>
        <NumberInput
          id="playerLimit"
          initialValue={props.filters.limit ?? fallbackLimit}
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
              This is the maximum number of performers that will be pulled from
              your Stash library. Less than {limitSoftMin} performers may return
              inaccurate results. More than {limitSoftMax} performers may cause
              the tournament to take too long and potentially cause slowdown.
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
              isChecked: false,
              id: "genderMale",
              label: "Male",
              name: "gender-male",
            },
            {
              isChecked: false,
              id: "genderFemale",
              label: "Female",
              name: "gender-female",
            },
            {
              isChecked: false,
              id: "genderTransgenderMale",
              label: "Transgender male",
              name: "gender-transgender_male",
            },
            {
              isChecked: false,
              id: "genderTransgenderFemale",
              label: "Transgender Female",
              name: "gender-transgender_female",
            },
            {
              isChecked: false,
              id: "genderIntersex",
              label: "Intersex",
              name: "gender-intersex",
            },
            {
              isChecked: false,
              id: "genderNonBinary",
              label: "Non-Binary",
              name: "gender-non_binary",
            },
          ]}
        >
          <small>
            <p className="mt-2">
              Select all the genders that qualify for the tournament. Selecting
              none will qualify any gender.
            </p>
          </small>
        </CheckboxGroup>
        <div className="d-flex mt-5">
          <button type="submit" className="btn btn-primary ml-auto">
            Save settings
          </button>
        </div>
      </form>
    </main>
  );
};

export default SettingsPage;
