"use server";

import { db } from "@/drizzle";
import { conversation, conversationUser } from "@/drizzle/schema";
import { pusherServer } from "@/lib/pusher";
import { authAction } from "@/lib/safe-action";
import { createUserSchema } from "@/validators/createUserSchema";
import { and, eq, inArray, isNull, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const createConversation = authAction
  .schema(createUserSchema)
  .action(async ({ parsedInput, ctx: { user: currentUser } }) => {
    if ("isGroup" in parsedInput) {
      const { members, name } = parsedInput;

      const newConversation = (
        await db
          .insert(conversation)
          .values({
            name,
            isGroup: true,
          })
          .returning()
      ).at(0);

      if (!newConversation) throw new Error("Failed to create conversation");

      const conversationUsers = await db
        .insert(conversationUser)
        .values([
          ...members.map((member: { value: string }) => ({
            userId: member.value,
            isOwner: member.value === currentUser.id,
            conversationId: newConversation.id,
          })),
        ])
        .returning();

      pusherServer.trigger(
        conversationUsers.map((user) => user.userId),
        "conversation:new",
        newConversation
      );

      revalidatePath("/conversations", "layout");

      return newConversation;
    }

    const { userId } = parsedInput;

    const existingConveration = (
      await db
        .select({
          id: conversationUser.conversationId,
          isGroup: conversation.isGroup,
        })
        .from(conversationUser)
        .leftJoin(
          conversation,
          eq(conversation.id, conversationUser.conversationId)
        )
        .groupBy(conversationUser.conversationId, conversation.isGroup)
        .having(sql`count(${conversationUser.conversationId}) > 1`)
        .where(
          and(
            inArray(conversationUser.userId, [currentUser.id!, userId]),
            or(eq(conversation.isGroup, false), isNull(conversation.isGroup))
          )
        )
    ).at(0);

    if (existingConveration) {
      return existingConveration;
    }

    const newConversation = (
      await db.insert(conversation).values({}).returning()
    ).at(0);

    if (!newConversation) throw new Error("Failed to create conversation");

    const users = await db
      .insert(conversationUser)
      .values([
        {
          userId: currentUser.id!,
          conversationId: newConversation.id,
        },
        {
          userId,
          conversationId: newConversation.id,
        },
      ])
      .returning();

    pusherServer.trigger(
      users.map((user) => user.userId),
      "conversation:new",
      newConversation
    );

    revalidatePath("/conversations", "layout");

    return { ...newConversation, users };
  });
