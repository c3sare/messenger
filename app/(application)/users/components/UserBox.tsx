"use client";

import { createConversation } from "@/actions/mutations/createConversation";
import Avatar from "@/components/Avatar";
import { users } from "@/drizzle/schema";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

type UserBoxProps = {
  data: (typeof users.$inferSelect);
};

const UserBox: React.FC<UserBoxProps> = ({ data }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => startTransition(async () => {
    const request = await createConversation({
      userId: data.id,
    });

    if (request?.data?.id) {
      router.push(`/conversations/${request.data.id}`);
    } else {
      toast.error("Something went wrong!");
    }
  });

  return (
    <button
      className="w-full relative my-2 flex items-center space-x-3 bg-white p-3 hover:bg-neutral-200 rounded-lg transition disabled:opacity-70"
      onClick={handleClick}
      aria-label={`Start a conversation with ${data.name}`}
      disabled={isPending}
    >
      <Avatar user={data} />
      <div
        className="min-w-0 flex-1"
      >
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-gray-900">{data.name}</p>
          </div>
        </div>
      </div>
    </button>
  );
};

export default UserBox;
