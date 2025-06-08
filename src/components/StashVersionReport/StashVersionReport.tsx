import type { StashVersion } from "@/apollo/schema";
import React from "react";

interface StashVersionReportProps {
  version: StashVersion["version"]["version"];
}

const StashVersionReport: React.FC<StashVersionReportProps> = (props) => {
  console.log(props);
  return <div>Version report</div>;
};

export default StashVersionReport;
