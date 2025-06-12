import React from "react";
import CheckboxGroup from "@/components/forms/CheckboxGroup/CheckboxGroup";

interface ReadOnlyModeProps {
  enabled: UserSettings["readOnly"];
}

const ReadOnlyMode: React.FC<ReadOnlyModeProps> = (props) => {
  return (
    <CheckboxGroup
      checkboxes={[
        {
          isChecked: props.enabled ?? false,
          id: "readOnly",
          label: 'Enable "read-only" mode',
          name: "read-only",
        },
      ]}
    >
      <small>
        <p className="mt-2">
          Read-only mode disables saving performer results to the Stash
          database. User settings and performer filters will still be saved to
          the Stash config.yml file as normal.
        </p>
      </small>
    </CheckboxGroup>
  );
};

export default ReadOnlyMode;
