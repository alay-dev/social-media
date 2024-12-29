import { XIcon } from "lucide-react";
import { ChangeEvent, Fragment, useCallback, useEffect, useState } from "react";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GET_USERS } from "@/graphql/query";
import { useAppStore } from "@/store/store";
import { GetUsersRes } from "@/types/user";
import { useQuery } from "@apollo/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Props {
  values: string[];
  onChange: (user: string) => void;
}

export function SearchUser({ values, onChange }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setOpen] = useState(false);
  const userId = useAppStore((state) => state.user);
  const { data } = useQuery<GetUsersRes>(GET_USERS, { variables: { id: userId }, skip: !userId });

  const autocomplete = data?.users.filter((item) => item.name?.toLowerCase()?.includes(searchTerm.toLowerCase()));

  const outsideClickListener = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const trigger = document.getElementById("user-trigger");
      const content = document.getElementById("user-content");
      if (content?.contains(target) || trigger?.contains(target) || !isOpen) return;
      setOpen(false);
    },
    [isOpen]
  );

  useEffect(() => {
    document.addEventListener("click", outsideClickListener);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    () => {
      document.removeEventListener("click", outsideClickListener);
    };
  }, [outsideClickListener]);

  const onFocus = () => {
    setOpen(true);
  };

  const onQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const onSelect = (user: string) => () => {
    setSearchTerm("");
    onChange(user);
  };

  const open = isOpen;

  return (
    <Fragment>
      <HoverCard open={open}>
        <HoverCardTrigger id="user-trigger" asChild className="w-full">
          <div className="flex flex-col border border-input rounded-md p-2 px-3 input-focus-visible bg-white">
            <div className="flex flex-wrap items-center  gap-2">
              {values?.map((item) => {
                const user = data?.users?.find((c) => c.id === item);
                return (
                  <div key={user?.id} className="py-1 pl-2 pr-1 inline-flex items-center rounded-md bg-accent/60 space-x-3 border ">
                    <span className="text-xs font-medium ">{user?.name}</span>
                    <button type="button" className="hover:bg-accent rounded-full p-1" onClick={() => onChange(item)}>
                      <XIcon size={14} />
                    </button>
                  </div>
                );
              })}
              <input placeholder="Tag people" id="user" value={searchTerm} onChange={onQueryChange} onFocus={onFocus} className="focus-visible:outline-none flex-1 placeholder:text-sm placeholder:text-gray-500 p-0" />
            </div>
          </div>
        </HoverCardTrigger>

        <HoverCardContent id="user-content" className="px-0 py-1 overflow-hidden ">
          <ScrollArea className="h-64">{!autocomplete?.length ? <SearchResultsEmpty /> : autocomplete.map((item) => <SearchResultItem name={item.name} onClick={onSelect(item.id)} key={item.id} avatar={item.avatar} />)}</ScrollArea>
        </HoverCardContent>
      </HoverCard>
    </Fragment>
  );
}

function SearchResultsEmpty() {
  return (
    <div className="h-64 p-4 break-words grid place-items-center w-full">
      <p className="text-body max-w-full overflow-hidden">No results found</p>
    </div>
  );
}

function SearchResultItem({ onClick, name, avatar }: { onClick: () => void; name: string; avatar: string }) {
  return (
    <button type="button" onClick={onClick} className="w-full flex items-center px-4 py-1 bg-card hover:bg-background text-xs">
      <div className="flex items-center space-x-3 flex-1 ">
        <Avatar className="w-8 h-8">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex items-center text-start text-sm flex-1">
          <span className="text-gray-700">{name}</span>
        </div>
      </div>
    </button>
  );
}
