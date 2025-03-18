import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import useOtherUser from "@/hooks/useOtherUser";
import Avatar from "@/components/Avatar";
import AvatarGroup from "@/components/AvatarGroup";
import { cn } from "@/lib/utils";
import getConversations from "@/actions/getConversations";
import getCurrentUser from "@/actions/getCurrentUser";

type ConversationBoxProps = {
  data: Awaited<ReturnType<typeof getConversations>>[number];
  selected: boolean;
  currentUser: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;
};

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
  currentUser,
}) => {
  const otherUser = useOtherUser(data, currentUser);
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data.id, router]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];

    return messages[messages.length - 1];
  }, [data.messages]);

  const userId = useMemo(() => {
    return currentUser.id;
  }, [currentUser.id]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seenBy || [];

    if (!userId) {
      return false;
    }

    if (lastMessage.senderId === userId) return true;

    return seenArray.filter((user) => user.id === userId).length !== 0;
  }, [lastMessage, userId]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "Sent an image";
    }

    if (lastMessage?.body) {
      return lastMessage.body;
    }

    return "Started a conversation";
  }, [lastMessage]);

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full relative my-2 flex items-center space-x-3 hover:bg-neutral-200 rounded-lg transition p-3",
        selected ? "bg-neutral-200" : "bg-white"
      )}
      disabled={selected}
      aria-label={`Start a conversation with ${data.name}`}
    >
      {data.isGroup ? (
        <AvatarGroup users={data.users} />
      ) : (
        <Avatar user={otherUser} />
      )}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="text-md font-medium text-gray-900">
              {data.name || otherUser.name}
            </p>
            {lastMessage?.createdAt && (
              <p className="text-xs text-gray-500 font-light">
                {format(new Date(lastMessage.createdAt), "p")}
              </p>
            )}
          </div>
          <p
            className={cn(
              `truncate text-xs text-left`,
              hasSeen ? "text-gray-600" : "text-black"
            )}
          >
            {lastMessage?.senderId === userId && <b>You: </b>}
            {lastMessageText}
          </p>
        </div>
      </div>
    </button>
  );
};

export default ConversationBox;
