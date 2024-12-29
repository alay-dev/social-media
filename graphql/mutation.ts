import { gql } from "@apollo/client";

export const ADD_POST = gql`
  mutation addPost($id: ID, $caption: String, $media: [String], $tags: [String], $createdBy: String) {
    addPost(id: $id, caption: $caption, media: $media, tags: $tags, createdBy: $createdBy)
  }
`;

export const SIGNUP = gql`
  mutation signUp($id: ID, $name: String, $email: String, $location: String, $avatar: String, $password: String) {
    signUp(id: $id, name: $name, email: $email, location: $location, avatar: $avatar, password: $password)
  }
`;

export const LOGIN = gql`
  mutation login($email: String, $password: String) {
    login(email: $email, password: $password) {
      id
      name
      email
      avatar
      location
      following {
        id
        name
        location
        avatar
      }
    }
  }
`;

export const GOOGLE_LOGIN = gql`
  mutation googleLogin($email: String!, $avatar: String!, $name: String!) {
    googleLogin(email: $email, avatar: $avatar, name: $name) {
      id
      name
      email
      avatar
      location
      following {
        id
        name
        location
        avatar
      }
    }
  }
`;

export const FOLLOW_USER = gql`
  mutation followUser($id: ID!, $activeUserId: ID!) {
    followUser(id: $id, activeUserId: $activeUserId)
  }
`;

export const UNFOLLOW_USER = gql`
  mutation unfollowUser($id: ID!, $activeUserId: ID!) {
    unfollowUser(id: $id, activeUserId: $activeUserId)
  }
`;
