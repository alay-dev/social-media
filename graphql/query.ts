import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query getUserFeed($id: ID!) {
    posts(id: $id) {
      id
      caption
      media
      createdBy
      tags {
        name
      }
    }
  }
`;

export const GET_USERS = gql`
  query users($id: ID!) {
    users(id: $id) {
      id
      name
      avatar
      location
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query getUserById($id: ID!) {
    user(id: $id) {
      id
      name
      avatar
      location
      following {
        id
        name
      }
    }
  }
`;

export const GET_ACTIVE_USER = gql`
  query getActiveUser($id: ID!) {
    user(id: $id) {
      id
      name
      avatar
      location
      following {
        id
        name
      }
    }
  }
`;
