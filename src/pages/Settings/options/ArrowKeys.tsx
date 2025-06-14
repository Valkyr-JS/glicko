import React from "react";
import CheckboxGroup from "@/components/forms/CheckboxGroup/CheckboxGroup";
import { DEFAULT_ALLOW_ARROW_KEYS } from "@/constants";

interface ArrowKeysProps {
  enabled: UserSettings["arrowKeys"];
}

const ArrowKeys: React.FC<ArrowKeysProps> = (props) => {
  return (
    <CheckboxGroup
      checkboxes={[
        {
          isChecked:
            props.enabled === undefined
              ? DEFAULT_ALLOW_ARROW_KEYS
              : props.enabled,
          id: "arrowKeys",
          label: "Enable arrow keys",
          name: "arrow-keys",
        },
      ]}
    >
      <small>
        <p className="mt-2">
          When enabled, the left and right arrow keys can be used to select
          performers in a matchup.
        </p>
      </small>
    </CheckboxGroup>
  );
};

export default ArrowKeys;
