"use server";

import { db } from "@/drizzle";
import { conversation, message, messageRead } from "@/drizzle/schema";
import { pusherServer } from "@/lib/pusher";
import { authAction } from "@/lib/safe-action";
import { createMessageSchema } from "@/validators/createMessageSchema";
import { eq } from "drizzle-orm";

export const createMessage = authAction.schema(createMessageSchema).action(
  async ({
    parsedInput,
    ctx: {
      user: { id: userId },
    },
  }) => {
    const { conversationId, image, body } = parsedInput;

    if (!userId) throw new Error("User not found");

    const newMessage = (
      await db
        .insert(message)
        .values({
          body,
          image,
          conversationId,
          senderId: userId,
        })
        .returning()
    ).at(0);

    if (!newMessage) throw new Error("Message not created");

    await db.insert(messageRead).values({
      userId,
      messageId: newMessage.id,
    });

    await db
      .update(conversation)
      .set({
        lastMessageAt: new Date(),
      })
      .where(eq(conversation.id, conversationId));

    const updatedConversation = await db.query.conversation.findFirst({
      where: (conversation, { eq }) => eq(conversation.id, conversationId),
      with: {
        messages: true,
        users: true,
      },
    });

    if (!updatedConversation) throw new Error("Conversation not found");

    const updateMessage = await db.query.message.findFirst({
      where: (message, { eq }) => eq(message.id, newMessage.id),
      with: {
        sender: true,
        seenBy: {
          with: {
            user: true,
          },
        },
      },
    });

    if (!updateMessage) throw new Error("Message not found");

    const { seenBy, ...updateMessageBody } = updateMessage;

    const transformedMessage = {
      ...updateMessageBody,
      seen: seenBy.map(({ user }) => user),
    };

    await pusherServer.trigger(
      `conversation-${conversationId}`,
      "messages:new",
      transformedMessage
    );

    const lastMessage = transformedMessage;

    updatedConversation.users.map((user) => {
      pusherServer.trigger(user.userId, "conversation:update", {
        id: conversationId,
        messages: [lastMessage],
      });
    });

    return newMessage;
  }
);
