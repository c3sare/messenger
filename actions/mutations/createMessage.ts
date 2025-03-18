"use server";

import { db } from "@/drizzle";
import { conversations, messages, messageReads } from "@/drizzle/schema";
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
        .insert(messages)
        .values({
          body,
          image,
          conversationId,
          senderId: userId,
        })
        .returning()
    ).at(0);

    if (!newMessage) throw new Error("Message not created");

    await db.insert(messageReads).values({
      userId,
      messageId: newMessage.id,
    });

    await db
      .update(conversations)
      .set({
        lastMessageAt: new Date(),
      })
      .where(eq(conversations.id, conversationId));

    const updatedConversation = await db.query.conversations.findFirst({
      where: {
        id: conversationId,
      },
      with: {
        messages: true,
        users: true,
      },
    });

    if (!updatedConversation) throw new Error("Conversation not found");

    const updateMessage = await db.query.messages.findFirst({
      where: {
        id: newMessage.id,
      },
      with: {
        sender: true,
        seenBy: true,
      },
    });

    if (!updateMessage) throw new Error("Message not found");

    const { seenBy, ...updateMessageBody } = updateMessage;

    const transformedMessage = {
      ...updateMessageBody,
      seen: seenBy,
    };

    await pusherServer.trigger(
      `conversation-${conversationId}`,
      "messages:new",
      transformedMessage
    );

    const lastMessage = transformedMessage;

    updatedConversation.users.map((user) => {
      pusherServer.trigger(user.id, "conversation:update", {
        id: conversationId,
        messages: [lastMessage],
      });
    });

    return newMessage;
  }
);
