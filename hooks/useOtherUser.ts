import { useMemo } from "react";
import { FullConversationType } from "@/types";
import getConversations from "@/actions/getConversations";
import getCurrentUser from "@/actions/getCurrentUser";

type Props =
  | Awaited<ReturnType<typeof getConversations>>[number]
  | FullConversationType;

const useOtherUser = (
  conversation: Props,
  currentUser: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>
) => {
  const otherUser = useMemo(() => {
    const currentUserEmail = currentUser.email;

    const otherUser = conversation.users?.filter(
      (user) => user.email !== currentUserEmail
    );

    return otherUser;
  }, [currentUser.email, conversation.users]);

  return otherUser?.[0] ?? null;
};

export default useOtherUser;
