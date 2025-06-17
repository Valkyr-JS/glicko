import { gql } from "@apollo/client";

export const GET_ALL_PERFORMERS_BY_PAGE = gql`
  query GetPerformersByPage($page: Int, $perPage: Int) {
    findPerformers(filter: { page: $page, per_page: $perPage }) {
      count
      performers {
        custom_fields
        id
        image_path
        name
      }
    }
  }
`;

export const GET_ALL_PERFORMERS_WITH_HISTORY_BY_PAGE = gql`
  query GetPerformersWithHistoryByPage($page: Int, $perPage: Int) {
    findPerformers(
      filter: { page: $page, per_page: $perPage }
      performer_filter: {
        custom_fields: {
          field: "glicko_match_history"
          value: ["[]"]
          modifier: NOT_EQUALS
        }
        AND: {
          custom_fields: { field: "glicko_match_history", modifier: NOT_NULL }
        }
      }
    ) {
      count
      performers {
        custom_fields
        id
        image_path
        name
      }
    }
  }
`;

export const GET_ALL_PERFORMERS_BY_PAGE_NO_CUSTOM = gql`
  query GetPerformersByPage($page: Int, $perPage: Int) {
    findPerformers(filter: { page: $page, per_page: $perPage }) {
      count
      performers {
        id
        image_path
        name
      }
    }
  }
`;

export const GET_PERFORMER_IMAGE = gql`
  query GetPerformerImage($performerID: ID!, $currentImageID: Int!) {
    findImages(
      filter: { per_page: 1, sort: "random" }
      image_filter: {
        performers: { value: [$performerID], modifier: INCLUDES }
        orientation: { value: PORTRAIT }
        id: { value: $currentImageID, modifier: NOT_EQUALS }
      }
    ) {
      count
      images {
        id
        paths {
          image
          thumbnail
        }
      }
    }
  }
`;

export const GET_MATCH_PERFORMERS = gql`
  query GetPerformers(
    $genders: [GenderEnum!]
    $endpoint: StashIDCriterionInput
    $exclude: String!
  ) {
    findPerformers(
      filter: { per_page: 2, sort: "random" }
      performer_filter: {
        gender: { value_list: $genders, modifier: INCLUDES }
        stash_id_endpoint: $endpoint
        NOT: { name: { value: $exclude, modifier: EQUALS } }
      }
    ) {
      count
      performers {
        custom_fields
        id
        image_path
        name
      }
    }
  }
`;

export const GET_MATCH_PERFORMERS_NO_CUSTOM = gql`
  query GetPerformers(
    $genders: [GenderEnum!]
    $endpoint: StashIDCriterionInput
    $exclude: String!
  ) {
    findPerformers(
      filter: { per_page: 2, sort: "random" }
      performer_filter: {
        gender: { value_list: $genders, modifier: INCLUDES }
        stash_id_endpoint: $endpoint
        NOT: { name: { value: $exclude, modifier: EQUALS } }
      }
    ) {
      count
      performers {
        id
        image_path
        name
      }
    }
  }
`;

export const GET_SPECIFIC_MATCH_PERFORMERS = gql`
  query GetSpecificPerformers($ids: [Int!]) {
    findPerformers(performer_ids: $ids) {
      count
      performers {
        custom_fields
        id
        image_path
        name
      }
    }
  }
`;

export const GET_SPECIFIC_MATCH_PERFORMERS_NO_CUSTOM = gql`
  query GetSpecificPerformers($ids: [Int!]) {
    findPerformers(performer_ids: $ids) {
      count
      performers {
        id
        image_path
        name
      }
    }
  }
`;

export const GET_STASH_CONFIGURATION = gql`
  query GetStashConfiguration {
    configuration {
      general {
        stashBoxes {
          endpoint
          name
        }
      }
      plugins
    }
  }
`;

export const GET_STASH_VERSION = gql`
  query GetStashVersion {
    version {
      version
    }
  }
`;
