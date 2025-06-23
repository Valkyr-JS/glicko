import React from "react";
import CheckboxGroup from "@/components/forms/CheckboxGroup/CheckboxGroup";

interface MinimalMatchHistoryProps {
  enabled: UserSettings["minimalMatchHistory"];
}

const MinimalMatchHistory: React.FC<MinimalMatchHistoryProps> = (props) => {
  return (
    <CheckboxGroup
      checkboxes={[
        {
          isChecked: !!props.enabled,
          id: "minimalMatchHistory",
          label: "Track minimal match history",
          labelAsHeading: true,
          name: "minimal-match-history",
        },
      ]}
    >
      <small>
        <p className="mt-2">
          Every performer's match history is tracked in order to support
          features like stat analysis that are planned for future updates. This
          history is saved as a data object in the performer's custom fields.
        </p>
        <p>
          Enabling minimal match history restricts this to track only the last
          match each performer played.
        </p>
      </small>
    </CheckboxGroup>
  );
};

export default MinimalMatchHistory;
