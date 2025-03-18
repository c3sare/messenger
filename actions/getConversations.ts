import { db } from "@/drizzle";
import getCurrentUser from "./getCurrentUser";

const getConversations = async () => {
  const currentUser = await getCurrentUser();

  const userId = currentUser?.id;

  if (!userId) {
    return [];
  }

  try {
    const user = await db.query.users.findFirst({
      where: {
        id: userId,
      },
      with: {
        conversations: {
          with: {
            messages: {
              limit: 1,
              orderBy: (message, { desc }) => desc(message.createdAt),
              with: {
                sender: true,
                seenBy: {
                  columns: {
                    hashedPassword: false,
                  },
                },
              },
            },
            users: true,
          },
        },
      },
    });

    if (!user) throw new Error("User not found");

    return user.conversations;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getConversations;
