import React from "react";
import NewPost from "../components/common/new-post";
import Post from "../components/common/post";
import { useQuery } from "@apollo/client";
import { GET_POSTS } from "@/graphql/query";
import { GetPostsRes } from "@/types/post";
import { useAppStore } from "@/store/store";

const Main = () => {
  const userId = useAppStore((state) => state.user);
  const { data } = useQuery<GetPostsRes>(GET_POSTS, { variables: { id: userId }, skip: !userId });

  return (
    <div className="flex flex-col items-center flex-1">
      <NewPost />
      <div className="flex flex-col gap-4 w-full">
        {data?.posts?.map((item) => {
          return <Post key={item.id} createdBy={item.createdBy} caption={item.caption} media={item.media} tags={item.tags} location={item.location} />;
        })}
      </div>
    </div>
  );
};

export default Main;
