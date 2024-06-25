import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "@/types";
import getConversations from "@/actions/getConversations";

type Props =
  | Awaited<ReturnType<typeof getConversations>>[number]
  | FullConversationType;

const useOtherUser = (conversation: Props) => {
  const session = useSession();

  const otherUser = useMemo(() => {
    const currentUserEmail = session?.data?.user?.email;

    const otherUser = conversation.users?.filter(
      (user) => user.email !== currentUserEmail
    );

    return otherUser;
  }, [session?.data?.user?.email, conversation.users]);

  return otherUser?.[0] ?? null;
};

export default useOtherUser;
