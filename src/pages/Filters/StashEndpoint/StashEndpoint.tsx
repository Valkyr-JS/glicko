import RadioGroup from "@/components/forms/RadioGroup/RadioGroup";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons/faSpinnerThird";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface StashEndpointFilterProps {
  stashConfig?: StashConfigResult;
}

const StashEndpointFilter: React.FC<StashEndpointFilterProps> = (props) => {
  if (!props.stashConfig) {
    return (
      <div>
        <FontAwesomeIcon icon={faSpinnerThird} spin className="mr-2" />
        <span>Loading...</span>
      </div>
    );
  }

  const name = "endpoints";

  return (
    <RadioGroup
      title="Stashbox endpoints"
      name="endpoint"
      radios={[
        {
          id: "endpointNoCheck",
          isChecked: true,
          label: "Don't check",
          name,
          value: "undefined",
        },
        ...props.stashConfig.general.stashBoxes.map((box) => {
          return {
            id: "endpoint" + box.name,
            isChecked: false,
            label: box.name,
            name,
            value: box.name,
          };
        }),
        {
          id: "endpointNone",
          isChecked: false,
          label: "No endpoint",
          name,
          value: "IS_NULL",
        },
        {
          id: "endpointAny",
          isChecked: false,
          label: "Any endpoint",
          name,
          value: "NOT_NULL",
        },
      ]}
    >
      <small>
        <p className="mt-2">
          Select the Stash box endpoint that performers must have an ID for.
        </p>
        <p>
          Select "No endpoint" for performers that don't have any endpoint IDs,
          or "Any endpoint" for performers who have at least one endpoint ID of
          any kind. Select "Don't check" if you don't want to use this filter.
        </p>
      </small>
    </RadioGroup>
  );
};

export default StashEndpointFilter;
