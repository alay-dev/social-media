import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FOLLOW_USER, UNFOLLOW_USER } from "@/graphql/mutation";
import { GET_ACTIVE_USER, GET_POSTS, GET_USERS } from "@/graphql/query";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/store/store";
import { GetUserByIdRes } from "@/types/user";
import { useMutation, useQuery } from "@apollo/client";

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  avatar: string;
  id: string;
  location: string;
  name: string;
};

const ProfileDetail = ({ children, avatar, location, name, id }: Props) => {
  const userId = useAppStore((state) => state.user);
  const { toast } = useToast();

  const { data: activeUser } = useQuery<GetUserByIdRes>(GET_ACTIVE_USER, { variables: { id: userId }, skip: !userId });
  const [followUser, { loading: followLoading }] = useMutation(FOLLOW_USER, {
    refetchQueries: [
      { query: GET_ACTIVE_USER, variables: { id: userId } },
      { query: GET_POSTS, variables: { id: userId } },
    ],
    awaitRefetchQueries: true,
  });

  const [unfollowUser, { loading: unfollowLoading }] = useMutation(UNFOLLOW_USER, {
    refetchQueries: [
      { query: GET_ACTIVE_USER, variables: { id: userId } },
      { query: GET_POSTS, variables: { id: userId } },
      { query: GET_USERS, variables: { id: userId } },
    ],
    awaitRefetchQueries: true,
  });

  const handleFollowUser = async () => {
    if (followLoading) return;
    try {
      await followUser({ variables: { id: id, activeUserId: activeUser?.user?.id } });
    } catch (error) {
      toast({ title: "Failed to follow user", description: "Please try again", variant: "destructive" });
      console.log(error);
    }
  };

  const handleUnfollowUser = async () => {
    if (unfollowLoading) return;
    try {
      await unfollowUser({ variables: { id: id, activeUserId: activeUser?.user?.id } });
    } catch (error) {
      toast({ title: "Failed to unfollow user", description: "Please try again", variant: "destructive" });
      console.log(error);
    }
  };

  const isFollowing = activeUser?.user?.following?.findIndex((item) => item.id === id) === -1 ? false : true;

  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent align="center" side="right" className=" min-w-[16rem] p-5 rounded-xl ">
        <div className="flex flex-col justify-center gap-2 items-center">
          <Avatar className="w-24 h-24">
            <AvatarImage src={avatar} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="">
            <h2 className="font-semibold text-center">{name}</h2>
            <p className="text-xs text-center text-gray-500">{location}</p>
          </div>
        </div>

        {isFollowing ? (
          <Button onClick={handleUnfollowUser} className="mt-8 w-full font-semibold border border-red-400 text-red-500 hover:text-red-600" variant={"outline"} size={"sm"}>
            Unfollow
          </Button>
        ) : (
          <Button onClick={handleFollowUser} className="mt-8 w-full font-semibold " size={"sm"}>
            Follow
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default ProfileDetail;
