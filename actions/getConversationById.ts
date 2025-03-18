import { db } from "@/drizzle";
import getCurrentUser from "./getCurrentUser";

const getConversationById = async (conversationId: number) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return null;
    }

    const conversation = await db.query.conversations.findFirst({
      where: {
        id: conversationId,
      },
      with: {
        users: {
          columns: {
            hashedPassword: false,
          },
        },
        messages: {
          orderBy: (message, { asc }) => asc(message.createdAt),
          with: {
            sender: true,
            seenBy: true,
          },
        },
      },
    });

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    return conversation;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getConversationById;
