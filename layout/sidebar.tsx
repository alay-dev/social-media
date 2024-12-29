import { Separator } from "@/components/ui/separator";
import { SIDEBAR_WIDTH } from "@/constants/layout";
import { GET_ACTIVE_USER, GET_USERS } from "@/graphql/query";
import { useAppStore } from "@/store/store";
import { GetUserByIdRes, GetUsersRes } from "@/types/user";
import { useQuery } from "@apollo/client";
import { faBookmark, faGear, faHouse, faMessage, faPersonChalkboard, faShop, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Follower from "../components/common/follower";

const Sidebar = () => {
  const userId = useAppStore((state) => state.user);

  const { data: user } = useQuery<GetUserByIdRes>(GET_ACTIVE_USER, { variables: { id: userId }, skip: !userId });
  const { data } = useQuery<GetUsersRes>(GET_USERS, { variables: { id: userId }, skip: !userId });

  return (
    <nav className="bg-white fixed h-screen pt-6 border-r z-20  sm:block" style={{ width: SIDEBAR_WIDTH }}>
      <h1 className="font-extrabold text-2xl px-6">Connectly</h1>
      <nav className="mt-[2rem] flex flex-col gap-2 text-sm font-semibold text-gray-600 px-4">
        <li className="flex items-center gap-3 bg-blue-50 border border-blue-300 p-2 text-blue-800 font-bold rounded-md transition-all cursor-pointer">
          <FontAwesomeIcon icon={faHouse} size={"lg"} color="#2196F3" />
          Feed
        </li>
        <li className="flex items-center gap-3 hover:bg-blue-50 p-2 rounded-md transition-all cursor-pointer">
          <FontAwesomeIcon icon={faPersonChalkboard} color="#2196F3" />
          Explore
        </li>
        <li className="flex items-center gap-3 hover:bg-blue-50 p-2 rounded-md transition-all cursor-pointer">
          <FontAwesomeIcon icon={faShop} size={"lg"} color="#2196F3" />
          Marketplace
        </li>
        <li className="flex items-center gap-3 hover:bg-blue-50 p-2 rounded-md transition-all cursor-pointer">
          <FontAwesomeIcon icon={faUserGroup} size={"lg"} color="#2196F3" />
          Groups
        </li>
        <li className="flex items-center gap-3 hover:bg-blue-50 p-2 rounded-md transition-all cursor-pointer">
          <FontAwesomeIcon icon={faBookmark} size={"lg"} color="#2196F3" />
          My favorites
        </li>
        <li className="flex items-center gap-3 hover:bg-blue-50 p-2 rounded-md transition-all cursor-pointer">
          <FontAwesomeIcon icon={faMessage} size={"lg"} color="#2196F3" />
          Messages
        </li>
        <li className="flex items-center gap-3 hover:bg-blue-50 p-2 rounded-md transition-all cursor-pointer">
          <FontAwesomeIcon icon={faGear} size={"lg"} color="#2196F3" />
          Settings
        </li>
      </nav>
      <Separator className="my-6" />
      <div className="px-6">
        <h3 className="font-extrabold mb-4">Top users</h3>
        <div className="flex flex-col gap-4">
          {data?.users
            ?.filter((item) => item.id !== user?.user?.id)
            ?.slice(0, 5)
            .map((item) => (
              <Follower key={item.id} avatar={item.avatar} id={item.id} location={item.location} name={item.name} />
            ))}
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
