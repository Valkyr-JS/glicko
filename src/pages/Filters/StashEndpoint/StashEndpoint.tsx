import RadioGroup from "@/components/forms/RadioGroup/RadioGroup";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons/faSpinnerThird";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface StashEndpointFilterProps {
  endpointFilter: StashIDCriterionInput | undefined;
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

  return (
    <RadioGroup
      title="Stashbox endpoints"
      name="endpoint"
      radios={[
        ...props.stashConfig.general.stashBoxes.map((box) => {
          return {
            id: "endpoint" + box.name,
            isChecked: props.endpointFilter?.endpoint === box.endpoint,
            label: box.name,
            value: box.endpoint,
          };
        }),
        {
          id: "endpointAny",
          isChecked: props.endpointFilter?.modifier === "NOT_NULL",
          label: "Any endpoint",
          value: "NOT_NULL",
        },
        {
          id: "endpointNone",
          isChecked: props.endpointFilter?.modifier === "IS_NULL",
          label: "No endpoint",
          value: "IS_NULL",
        },
        {
          id: "endpointNoCheck",
          isChecked: props.endpointFilter === undefined,
          label: "Don't check",
          value: "undefined",
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
