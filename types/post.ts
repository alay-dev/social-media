import { User } from "./user";

export type Post = {
  id: string;
  caption: string;
  tags: User[];
  media: string[];
  createdBy: string;
  location: string;
};

export type GetPostsRes = {
  posts: Post[];
};
