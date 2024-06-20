import { db } from "@/drizzle";
import getCurrentUser from "./getCurrentUser";

const getConversationById = async (conversationId: number) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email) {
      return null;
    }

    const conversation = await db.query.conversation.findFirst({
      where: (conversation, { eq }) => eq(conversation.id, conversationId),
      with: {
        users: {
          with: {
            user: {
              columns: {
                hashedPassword: false,
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    return {
      ...conversation,
      users: conversation.users.map((user) => ({
        ...user.user,
        joinedAt: user.joinedAt,
      })),
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getConversationById;
