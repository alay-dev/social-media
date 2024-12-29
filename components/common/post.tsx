import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GET_USER_BY_ID } from "@/graphql/query";
import type { Post } from "@/types/post";
import { GetUserByIdRes } from "@/types/user";
import { useQuery } from "@apollo/client";
import { faComment, faHeart, faPaperPlane, faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Carousel } from "react-responsive-carousel";

type Props = Omit<Post, "id">;

const Post = ({ caption, media, createdBy, tags }: Props) => {
  const { data } = useQuery<GetUserByIdRes>(GET_USER_BY_ID, { variables: { id: createdBy } });

  return (
    <div className="rounded-xl p-4 bg-white w-full border border-blue-200">
      <div className="flex items-center gap-3 mb-4">
        <Avatar>
          <AvatarImage src={data?.user.avatar} />
          <AvatarFallback>{data?.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-bold text-sm">{data?.user?.name}</h3>
          <p className="text-gray-500 text-xs">{data?.user?.location || "somewhere"}</p>
        </div>
      </div>
      <p className="text-sm">{caption}</p>
      <div className="flex items-center gap-2">
        {tags?.map((item) => (
          <p key={item.id} className="text-sm text-blue-700 hover:underline cursor-pointer">
            @{item.name}
          </p>
        ))}
      </div>
      {media.length ? (
        <Carousel showIndicators={media.length === 1 ? false : true} showStatus={false} showThumbs={false}>
          {media?.map((item) => {
            return (
              <div key={item} className="rounded-xl mt-2 overflow-hidden w-full h-[20rem]">
                <img alt="" src={item} className="max-h-[20rem] object-cover w-full" />
              </div>
            );
          })}
        </Carousel>
      ) : null}
      <div className="flex items-center justify-between mt-3 text-sm text-gray-600 mb-2">
        <p className="hover:underline cursor-pointer">13 comments</p>
        <p className="hover:underline cursor-pointer">340 likes</p>
      </div>
      <Separator />
      <div className="flex items-center justify-between my-2 text-sm">
        <div className="flex items-center gap-1">
          <FontAwesomeIcon icon={faHeart} size={"lg"} color="#2196F3" />
          <p>Like</p>
        </div>
        <div className="flex items-center gap-1">
          <FontAwesomeIcon icon={faComment} size={"lg"} color="#2196F3" />
          <p>Comment</p>
        </div>
        <div className="flex items-center gap-1">
          <FontAwesomeIcon icon={faShare} size={"lg"} color="#2196F3" />
          <p>Share</p>
        </div>
      </div>
      <Separator />
      <div className="flex items-center gap-2 mt-2">
        <textarea className="resize-none bg-gray-100 w-full p-3 py-2 rounded-lg focus:outline" rows={1} placeholder="Write a comment" />
        <Button className="bg-gray-100 hover:bg-gray-200">
          <FontAwesomeIcon icon={faPaperPlane} size={"lg"} color="#2196F3" />
        </Button>
      </div>
    </div>
  );
};

export default Post;
