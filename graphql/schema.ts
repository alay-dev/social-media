import { gql } from "apollo-server-micro";

export const typeDefs = gql`
  type User {
    id: ID
    name: String
    location: String
    avatar: String
    following: [User]
    password: String
    email: String
  }

  type Post {
    id: ID
    caption: String
    tags: [User]
    media: [String]
    createdBy: String
  }

  type Query {
    users(id: ID!): [User]!
    user(id: ID!): User
    posts(id: ID!): [Post]
    post(id: ID!): Post
  }

  type Mutation {
    addPost(id: ID, caption: String, media: [String], tags: [String], createdBy: String): String
    signUp(id: ID, name: String, email: String, location: String, avatar: String, password: String): String
    login(email: String, password: String): User
    followUser(id: ID!, activeUserId: ID!): String
    unfollowUser(id: ID!, activeUserId: ID!): String
    googleLogin(email: String!, avatar: String!, name: String!): User
  }
`;
