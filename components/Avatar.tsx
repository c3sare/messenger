"use client";

import Image from "next/image";
import useActiveList from "../hooks/useActiveList";
import { FullConversationType } from "@/types";

interface AvatarProps {
  user?: FullConversationType["messages"][number]["sender"] | FullConversationType["users"][number]
}

const Avatar: React.FC<AvatarProps> = ({ user }) => {
  const { members } = useActiveList();

  const isActive = members.indexOf(user?.id!) !== -1;

  return (
    <div className="relative size-9 lg:size-11">
      <div
        className="relative inline-block rounded-full overflow-hidden size-9 md:size-11"
      >
        <Image
          alt="Avatar"
          src={user?.image || "/images/placeholder.jpg"}
          fill
        />
      </div>
      {isActive && (
        <span className="absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0 h-2 w-2 md:h-3 md:w-3" />
      )}
    </div>
  );
};

export default Avatar;
