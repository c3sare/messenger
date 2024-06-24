import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "../types";
import { users } from "@/drizzle/schema";

const useOtherUser = (
  conversation:
    | FullConversationType
    | {
        users: (typeof users.$inferSelect)[];
      }
) => {
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
