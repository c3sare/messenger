"use client";

import Avatar from "@/components/Avatar";
import useOtherUser from "@/hooks/useOtherUser";
import Link from "next/link";
import { useMemo, useState } from "react";
import ProfileDrawer from "./ProfileDrawer";
import AvatarGroup from "@/components/AvatarGroup";
import useActiveList from "@/hooks/useActiveList";
import { ChevronLeftIcon, EllipsisIcon } from "lucide-react";
import { FullConversationType } from "@/types";

type HeaderProps = {
  conversation: FullConversationType;
};

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const otherUser = useOtherUser(conversation);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }

    return isActive ? "Active" : "Offline";
  }, [conversation, isActive]);

  return (
    <>
      <ProfileDrawer
        data={conversation}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
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
        <EllipsisIcon
          size={32}
          onClick={() => setDrawerOpen(true)}
          className="text-sky-500 cursor-pointer hover:text-sky-600 transition"
        />
      </div>
    </>
  );
};

export default Header;
