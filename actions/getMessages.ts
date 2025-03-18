import { db } from "@/drizzle";

const getMessages = async (conversationId: number) => {
  try {
    const messages = await db.query.messages.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: "asc",
      },
      with: {
        sender: true,
        seenBy: {
          columns: {
            hashedPassword: false,
          },
        },
      },
    });

    return messages;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getMessages;
