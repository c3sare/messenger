"use server";

import { db } from "@/drizzle";
import { conversations, conversationUsers } from "@/drizzle/schema";
import { pusherServer } from "@/lib/pusher";
import { authAction } from "@/lib/safe-action";
import { createUserSchema } from "@/validators/createUserSchema";
import { and, eq, inArray, isNull, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const createConversation = authAction
  .schema(createUserSchema)
  .action(async ({ parsedInput, ctx: { user: currentUser } }) => {
    if ("members" in parsedInput) {
      const { members, name } = parsedInput;

      const newConversation = (
        await db
          .insert(conversations)
          .values({
            name,
            isGroup: true,
            ownerId: currentUser.id!,
          })
          .returning()
      ).at(0);

      if (!newConversation) throw new Error("Failed to create conversation");

      const users = await db
        .insert(conversationUsers)
        .values([
          ...[...members, currentUser.id!].map((userId) => ({
            userId,
            conversationId: newConversation.id,
          })),
        ])
        .returning();

      pusherServer.trigger(
        users.map((user) => user.userId),
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
          id: conversationUsers.conversationId,
          isGroup: conversations.isGroup,
        })
        .from(conversationUsers)
        .leftJoin(
          conversations,
          eq(conversations.id, conversationUsers.conversationId)
        )
        .groupBy(conversationUsers.conversationId, conversations.isGroup)
        .having(sql`count(${conversationUsers.conversationId}) > 1`)
        .where(
          and(
            inArray(conversationUsers.userId, [currentUser.id!, userId]),
            or(eq(conversations.isGroup, false), isNull(conversations.isGroup))
          )
        )
    ).at(0);

    if (existingConveration) {
      return existingConveration;
    }

    const newConversation = (
      await db.insert(conversations).values({}).returning()
    ).at(0);

    if (!newConversation) throw new Error("Failed to create conversation");

    const users = await db
      .insert(conversationUsers)
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

    const createdConversation = await db.query.conversations.findFirst({
      where: {
        id: newConversation.id,
      },
      with: {
        users: true,
      },
    });

    pusherServer.trigger(
      users.map((user) => user.userId),
      "conversation:new",
      createdConversation
    );

    revalidatePath("/conversations", "layout");

    return { ...newConversation, users };
  });
