import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HEADER_HEIGHT } from "@/constants/layout";
import { GET_ACTIVE_USER } from "@/graphql/query";
import { useAppStore } from "@/store/store";
import { GetUserByIdRes } from "@/types/user";
import { useQuery } from "@apollo/client";
import { faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const userId = useAppStore((state) => state.user);
  const { setUser, setAuthenticated } = useAppStore((state) => state);
  const { data: user } = useQuery<GetUserByIdRes>(GET_ACTIVE_USER, { variables: { id: userId }, skip: !userId });

  const onLogout = () => {
    setUser(null);
    setAuthenticated(false);
    localStorage.clear();
    router.push("/auth");
  };

  return (
    <header
      className="bg-white  fixed z-10 border-b px-8 flex w-full ml-0 "
      style={{
        height: HEADER_HEIGHT,
      }}
    >
      <div className="flex items-center gap-2 h-full ml-auto">
        <p className="text-sm font-bold text-gray-600">{user?.user?.name}</p>
        <Popover>
          <PopoverTrigger>
            <Avatar className="h-8 w-8 relative">
              <AvatarImage src={user?.user?.avatar} />
              <AvatarFallback>{user?.user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className="w-44 py-1 px-0 mr-5 rounded-lg">
            <ul className="text-sm">
              <li className="flex items-center gap-3 px-4 py-1 hover:bg-gray-100 cursor-pointer">
                <FontAwesomeIcon icon={faUser} />
                Profile
              </li>
              <li onClick={onLogout} className="flex items-center gap-3 text-red-600 px-4 py-1 hover:bg-gray-100 cursor-pointer">
                <FontAwesomeIcon icon={faSignOut} />
                Logout
              </li>
            </ul>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default Header;
