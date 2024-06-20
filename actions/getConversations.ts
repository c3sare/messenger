import { db } from "@/drizzle";
import { auth } from "@/auth";

const getConversations = async () => {
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) {
    return [];
  }

  try {
    const user = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.id, userId),
      with: {
        conversations: {
          with: {
            conversation: true,
          },
        },
      },
    });

    if (!user) throw new Error("User not found");

    return user.conversations.map((conversation) => ({
      ...conversation.conversation,
      joinedAt: conversation.joinedAt,
    }));
  } catch (error: any) {
    return [];
  }
};

export default getConversations;
