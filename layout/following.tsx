import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HEADER_HEIGHT, RIGHT_PANEL_WIDTH } from "@/constants/layout";
import { GET_ACTIVE_USER, GET_USERS } from "@/graphql/query";
import ProfileDetail from "@/modal/profile-detail";
import { useAppStore } from "@/store/store";
import { GetUserByIdRes, GetUsersRes } from "@/types/user";
import { useQuery } from "@apollo/client";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo, useState } from "react";

const Following = () => {
  const userId = useAppStore((state) => state.user);
  const { data: activeUser } = useQuery<GetUserByIdRes>(GET_ACTIVE_USER, { variables: { id: userId }, skip: !userId });
  const { data } = useQuery<GetUsersRes>(GET_USERS, { variables: { id: userId }, skip: !userId });
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = useMemo(() => {
    if (searchTerm === "") return [];
    return data?.users?.filter((item) => item.name.toLowerCase().includes(searchTerm?.toLowerCase()));
  }, [data?.users, searchTerm]);

  return (
    <aside className="bg-white fixed h-screen right-0 p-4 border-l hidden md:block" style={{ width: RIGHT_PANEL_WIDTH, top: HEADER_HEIGHT }}>
      <div className="flex items-center gap-4 ">
        <div className="flex flex-col items-center gap-1 relative">
          <Avatar className="h-14 w-14 relative">
            <AvatarImage src={activeUser?.user.avatar} />
            <AvatarFallback>{activeUser?.user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="absolute bottom-4 bg-green-700 rounded-full w-5 h-5 flex items-center justify-center">
            <FontAwesomeIcon icon={faPlus} color="#fff" />
          </div>
          <p className="text-xs">Add</p>
        </div>

        {data?.users.slice(4, 7)?.map((item) => (
          <div key={item.id} className="flex flex-col items-center gap-1">
            <Avatar key={item.id} className="w-14 h-14 ">
              <AvatarImage src={item.avatar} />
              <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <p className="text-xs">{item.name.split(" ")?.at(0)}</p>
          </div>
        ))}
      </div>
      <h3 className="mt-8 font-extrabold mb-1">Search for peoples</h3>
      <div className="bg-gray-100 rounded-md flex items-center gap-2 w-full p-2 mb-5">
        <FontAwesomeIcon icon={faSearch} size={"sm"} color="#90A4AE" />
        <input className="w-full bg-transparent focus: outline-none" placeholder="Search by name" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      <ScrollArea className="h-[62vh]">
        <div className="flex flex-col">
          {filtered?.length === 0 ? (
            <>
              <p className="text-gray-500 text-sm mb-3">People you may know</p>
              <div className="gap-5 flex flex-col">
                {data?.users?.slice(5, 9)?.map((item) => {
                  return (
                    <ProfileDetail key={item.id} avatar={item.avatar} id={item.id} location={item.location} name={item.name}>
                      <div className="flex items-center gap-3 relative ">
                        <Avatar key={item.id} className="">
                          <AvatarImage src={item.avatar} />
                          <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-start">
                          <h4 className="font-bold text-sm">{item.name}</h4>
                          <p className="text-sm text-gray-600">{item.location}</p>
                        </div>
                      </div>
                    </ProfileDetail>
                  );
                })}
              </div>
            </>
          ) : (
            filtered?.map((item) => {
              return (
                <ProfileDetail key={item.id} avatar={item.avatar} id={item.id} location={item.location} name={item.name}>
                  <div className="gap-5 flex flex-col mb-4 w-full">
                    <div key={item.id} className="flex items-center gap-3 relative w-full">
                      <Avatar key={item.id} className="">
                        <AvatarImage src={item.avatar} />
                        <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-sm text-start">{item.name}</h4>
                        <p className="text-sm text-gray-600 text-start">{item.location}</p>
                      </div>
                    </div>
                  </div>
                </ProfileDetail>
              );
            })
          )}
        </div>
      </ScrollArea>
    </aside>
  );
};

export default Following;
