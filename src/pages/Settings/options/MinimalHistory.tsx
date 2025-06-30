import React from "react";
import CheckboxGroup from "@/components/forms/CheckboxGroup/CheckboxGroup";
import { DEFAULT_MINIMAL_HISTORY } from "@/constants";

interface MinimalHistoryProps {
  enabled: UserSettings["minimalHistory"];
}

const MinimalHistory: React.FC<MinimalHistoryProps> = (props) => {
  return (
    <CheckboxGroup
      checkboxes={[
        {
          isChecked:
            props.enabled === undefined
              ? DEFAULT_MINIMAL_HISTORY
              : props.enabled,
          id: "minimalHistory",
          label: "Enable minimal match history",
          labelAsHeading: true,
          name: "minimal-history",
        },
      ]}
    >
      <small>
        <p className="mt-2">
          When enabled, only the data for each performer's most recent match and
          two most recent sessions will be saved to their profile, as opposed to
          saving data for all matches and sessions. This may impact future
          planned features, but reduce loading times and the size of performers'
          custom data.
        </p>
      </small>
    </CheckboxGroup>
  );
};

export default MinimalHistory;
