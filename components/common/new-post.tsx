import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { faImage, faSmile, faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

import { Separator } from "@/components/ui/separator";
import CreatePost from "../../modal/create-post";
import { useQuery } from "@apollo/client";
import { GetUserByIdRes } from "@/types/user";
import { GET_ACTIVE_USER } from "@/graphql/query";
import { useAppStore } from "@/store/store";

const NewPost = () => {
  const [postModal, setPostModal] = useState(false);
  const userId = useAppStore((state) => state.user);
  const { data: user, loading } = useQuery<GetUserByIdRes>(GET_ACTIVE_USER, { variables: { id: userId }, skip: !userId });

  if (loading) return null;

  return (
    <>
      <div className="bg-blue-600 rounded-xl p-4 w-full border mb-5 border-white">
        <div className="flex gap-4 items-start mb-5">
          <Avatar>
            <AvatarImage src={user?.user.avatar} />
            <AvatarFallback>{user?.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          {/* <textarea onKeyUp={} /> */}
          <div className="flex-1">
            <div role="button" className="bg-tranparent border border-blue-400 w-full rounded-lg p-2 placeholder:font-medium focus:outline-none text-blue-100" onClick={() => setPostModal(true)}>
              What&apos;s happening?
            </div>
          </div>
        </div>
        <Separator className="bg-blue-400" />
        <div className="flex gap-2 items-center justify-between px-2 md:px-10 mt-2">
          <div className="flex gap-2 items-center text-sm font-medium">
            <FontAwesomeIcon icon={faVideo} size={"lg"} color="#fff" />
            <p className="text-white">Live video</p>
          </div>
          <div className="flex gap-2 items-center text-sm font-medium group cursor-pointer">
            <FontAwesomeIcon icon={faImage} size={"lg"} color="#fff" />
            <label htmlFor="imageUpload" className="group-hover:underline text-white">
              Photos
            </label>
            <input
              id="imageUpload"
              className="hidden"
              type="file"
              accept="/image*"
              // onChange={(e) => onUpload(e)}
              multiple
              disabled
            />
          </div>
          <div className="flex gap-2 items-center text-sm font-medium">
            <FontAwesomeIcon icon={faSmile} size={"lg"} color="#fff" />
            <p className="text-white">Feeling</p>
          </div>
          {/* <Button type="submit" className="w-36 rounded-lg">
                  Post
                </Button> */}
        </div>
      </div>

      <CreatePost isOpen={postModal} onClose={() => setPostModal(false)} />
    </>
  );
};

export default NewPost;
