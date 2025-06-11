import React from "react";

interface StashEndpointFilterProps {
  stashConfig?: StashConfigResult;
}

const StashEndpointFilter: React.FC<StashEndpointFilterProps> = (props) => {
  console.log(props.stashConfig);
  return <div>Stash endpoints</div>;
};

export default StashEndpointFilter;
