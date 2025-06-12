import { gql } from "@apollo/client";

/** Overrides the Glicko plugin config object with the provided data. */
export const SET_PLUGIN_CONFIG = gql`
  mutation SetGlickoPluginConfig($input: Map!) {
    configurePlugin(plugin_id: "glicko", input: $input)
  }
`;
