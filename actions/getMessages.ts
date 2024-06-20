import { db } from "@/drizzle";

const getMessages = async (conversationId: number) => {
  try {
    const messages = await db.query.message.findMany({
      where: (message, { eq }) => eq(message.conversationId, conversationId),
      with: {
        sender: true,
        seenBy: {
          with: {
            user: {
              columns: {
                hashedPassword: false,
              },
            },
          },
        },
      },
      orderBy: (message, { asc }) => asc(message.createdAt),
    });

    return messages;
  } catch (error: any) {
    return null;
  }
};

export default getMessages;
