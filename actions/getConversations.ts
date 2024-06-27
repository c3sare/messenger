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
      where: (user, { eq }) => eq(user.id, userId),
      with: {
        conversations: {
          with: {
            conversation: {
              with: {
                messages: {
                  limit: 1,
                  orderBy: (message, { desc }) => desc(message.createdAt),
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
                },
                users: {
                  with: {
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) throw new Error("User not found");

    return user.conversations.map((conversation) => ({
      ...conversation.conversation,
      users: conversation.conversation.users.map((user) => ({
        ...user.user,
        joinedAt: user.joinedAt,
      })),
      messages: conversation.conversation.messages.map(
        ({ seenBy, ...message }) => ({
          ...message,
          seen: seenBy.map(({ user }) => user),
        })
      ),
    }));
  } catch (error: any) {
    return [];
  }
};

export default getConversations;
