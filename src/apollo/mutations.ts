import { gql } from "@apollo/client";

export const SET_PERFORMER_DATA = gql`
  mutation SetPerformerData($input: PerformerUpdateInput!) {
    performerUpdate(input: $input) {
      id
      custom_fields
      name
    }
  }
`;

/** Overrides the Glicko plugin config object with the provided data. */
export const SET_PLUGIN_CONFIG = gql`
  mutation SetGlickoPluginConfig($input: Map!) {
    configurePlugin(plugin_id: "glicko", input: $input)
  }
`;
