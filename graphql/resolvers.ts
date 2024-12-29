import { posts } from "@/data/post";
import { users } from "@/data/user";
import { waitForOneSecond } from "@/lib/utils";
import { GoogleLoginInput, User } from "@/types/user";
import { LoginInput } from "@/views/login";
import { ApolloError } from "@apollo/client";
import { GraphQLError } from "graphql";
import { nanoid } from "nanoid";

const db = {
  posts,
  users,
};

export const resolvers = {
  Query: {
    posts: async (_: any, args: { id: string }) => {
      const feedUsers = db.users.find((item) => item.id === args.id)?.following;
      feedUsers?.push(args.id);

      return db.posts
        .filter((item) => feedUsers?.includes(item.createdBy))
        ?.map((item) => {
          return {
            ...item,
            tags: item.tags?.map((tag) => users.find((item) => item.id === tag)),
          };
        });
    },

    users: async (_: any, args: { id: string }) => {
      return db.users.filter((item) => item.id !== args.id);
    },

    user: async (_: any, args: { id: string }) => {
      const user = db.users.find((item) => item.id === args.id);

      console.log(db.users, "active user");
      if (!user) throw new GraphQLError("User not found");
      const following = user?.following.map((id) => db.users.find((item) => item.id === id));

      return { ...user, following };
    },
  },

  Mutation: {
    addPost: async (_: any, args: any) => {
      await waitForOneSecond();
      db.posts.unshift({ id: args.id, caption: args.caption, media: args.media, tags: args.tags, createdBy: args.createdBy });

      return "success";
    },

    signUp: async (_: any, args: User) => {
      await waitForOneSecond();
      db.users.unshift({ avatar: args.avatar, id: args.id, location: args.location, name: args.name, password: args.password, email: args.email, following: ["2", "3"] });

      return "success";
    },

    login: async (_: any, args: LoginInput) => {
      const user = db.users.find((item) => item.email === args.email);

      if (!user) throw new GraphQLError("User not found");

      if (user && user.password !== args.password) throw new ApolloError({ errorMessage: "Incorrect password. Please try again" });

      const following = user.following.map((id) => db.users.find((item) => item.id === id));

      return {
        ...user,
        following,
      };
    },

    googleLogin: async (_: any, args: GoogleLoginInput) => {
      const user = db.users.find((item) => item.email === args.email);
      let newUser;
      let following;

      if (!user) {
        newUser = { avatar: args.avatar, email: args.email, following: ["1", "2", "3"], id: nanoid(), location: "", name: args.name, password: "" };
        db.users.unshift(newUser);
        following = newUser.following.map((id) => db.users.find((item) => item.id === id));
        return { ...newUser, following };
      } else {
        following = user.following.map((id) => db.users.find((item) => item.id === id));
        return { ...user, following };
      }
    },

    followUser: async (_: any, args: { id: string; activeUserId: string }) => {
      const updatedUsers = db.users.map((user) => {
        if (user.id === args.activeUserId)
          return {
            ...user,
            following: [...user.following, args.id],
          };

        return user;
      });

      db.users = updatedUsers;

      return "success";
    },

    unfollowUser: async (_: any, args: { id: string; activeUserId: string }) => {
      const updatedUsers = db.users.map((user) => {
        if (user.id === args.activeUserId)
          return {
            ...user,
            following: user.following.filter((item) => item !== args.id),
          };

        return user;
      });

      db.users = updatedUsers;

      console.log(updatedUsers, "Unfollow");

      return "success";
    },
  },
};
