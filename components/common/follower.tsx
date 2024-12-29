import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfileDetail from "../../modal/profile-detail";

type Props = {
  avatar: string;
  id: string;
  location: string;
  name: string;
};

const Follower = ({ avatar, id, location, name }: Props) => {
  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={avatar} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <ProfileDetail avatar={avatar} location={location} name={name} id={id}>
          <h3 className="font-semibold text-sm hover:underline cursor-pointer">
            {name}
          </h3>
        </ProfileDetail>
        <p className="text-xs text-gray-500">{location}</p>
      </div>
    </div>
  );
};

export default Follower;
