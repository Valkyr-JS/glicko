import CheckboxGroup from "@/components/forms/CheckboxGroup/CheckboxGroup";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons/faSpinnerThird";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface StashEndpointFilterProps {
  stashConfig?: StashConfigResult;
}

const StashEndpointFilter: React.FC<StashEndpointFilterProps> = (props) => {
  console.log(props.stashConfig);

  if (!props.stashConfig) {
    return (
      <div>
        <FontAwesomeIcon icon={faSpinnerThird} spin className="mr-2" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <CheckboxGroup
      title="Stashbox endpoints"
      checkboxes={props.stashConfig.general.stashBoxes.map((box) => {
        return {
          id: "endpoint" + box.name,
          isChecked: false,
          label: box.name,
          name: box.endpoint,
        };
      })}
    >
      <small>
        <p className="mt-2">
          Select the Stash box endpoints that performers must have an ID for.
          Selecting none will qualify performers whether they have an endpoint
          ID or not.
        </p>
      </small>
    </CheckboxGroup>
  );
};

export default StashEndpointFilter;
