"use client";

import Avatar from "@/components/Avatar";
import useOtherUser from "@/hooks/useOtherUser";
import Link from "next/link";
import { useMemo } from "react";
import ProfileDrawer from "./ProfileDrawer";
import AvatarGroup from "@/components/AvatarGroup";
import useActiveList from "@/hooks/useActiveList";
import { ChevronLeftIcon, EllipsisIcon } from "lucide-react";
import { FullConversationType } from "@/types";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

type HeaderProps = {
  conversation: FullConversationType;
};

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const otherUser = useOtherUser(conversation);
  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }

    return isActive ? "Active" : "Offline";
  }, [conversation, isActive]);

  return (
    <div className="bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
      <div className="flex gap-3 items-center">
        <Link
          href="/conversations"
          className="lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer"
        >
          <ChevronLeftIcon size={32} />
        </Link>
        {conversation.isGroup ? (
          <AvatarGroup users={conversation.users} />
        ) : (
          <Avatar user={otherUser} />
        )}
        <div className="flex flex-col">
          <div>{conversation.name || otherUser.name}</div>
          <div className="text-sm font-light text-neutral-500">
            {statusText}
          </div>
        </div>
      </div>
      <Dialog>
        <DialogTrigger>
          <EllipsisIcon
            size={32}
            className="text-sky-500 cursor-pointer hover:text-sky-600 transition"
          />
        </DialogTrigger>
        <ProfileDrawer
          data={conversation}
        />
      </Dialog>
    </div>
  );
};

export default Header;
