import { db } from "@/drizzle";
import getCurrentUser from "./getCurrentUser";

const getConversationById = async (conversationId: number) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
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
        messages: {
          with: {
            sender: true,
            seenBy: {
              with: {
                user: true,
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
      messages: conversation.messages.map(({ seenBy, ...message }) => ({
        ...message,
        seen: seenBy.map(({ user }) => user),
      })),
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getConversationById;
