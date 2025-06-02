import React, { useState } from "react";
import { default as cx } from "classnames";
import styles from "./Settings.module.scss";
import type { PlayerFilters } from "@/types/global";
import NumberInput from "@/components/forms/NumberInput";

interface SettingsPageProps {
  /** The current filters. */
  filters: PlayerFilters;
  /** Dictates whether a tournament is in progress. */
  inProgress: boolean;
}

const SettingsPage: React.FC<SettingsPageProps> = (props) => {
  console.log(props.inProgress);

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

  /* ------------------------------------------ Component ----------------------------------------- */

  return (
    <main className={classes}>
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
    </main>
  );
};

export default SettingsPage;
