import { gql } from "@apollo/client";

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

export const GET_PERFORMERS = gql`
  query GetPerformers($genders: [GenderEnum!], $limit: Int) {
    findPerformers(
      filter: { per_page: $limit, sort: "random" }
      performer_filter: { gender: { value_list: $genders, modifier: INCLUDES } }
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

export const GET_SPECIFIC_MATCH_PERFORMERS = gql`
  query GetPerformers($ids: [Int!]) {
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

export const GET_MATCH_PERFORMERS = gql`
  query GetPerformers($genders: [GenderEnum!]) {
    findPerformers(
      filter: { per_page: 2, sort: "random" }
      performer_filter: { gender: { value_list: $genders, modifier: INCLUDES } }
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

export const GET_STASH_VERSION = gql`
  query GetStashVersion {
    version {
      version
    }
  }
`;
