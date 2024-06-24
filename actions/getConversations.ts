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
            conversation: {
              with: {
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
      users: conversation.conversation.users.map((user) => user.user),
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
