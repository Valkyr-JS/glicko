import { gql } from "@apollo/client";

export const GET_PERFORMER_IMAGE = gql`
  query GetPerformerImage($performerID: ID!, $prevID: Int!) {
    findImages(
      filter: { per_page: 1, sort: "random" }
      image_filter: {
        performers: { value: [$performerID], modifier: INCLUDES }
        orientation: { value: PORTRAIT }
        id: { value: $prevID, modifier: NOT_EQUALS }
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
