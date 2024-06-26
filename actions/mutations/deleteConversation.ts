"use server";

import { db } from "@/drizzle";
import { conversation } from "@/drizzle/schema";
import { authAction } from "@/lib/safe-action";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const deleteConversation = authAction.schema(z.number()).action(
  async ({
    parsedInput: conversationId,
    ctx: {
      user: { id: userId },
    },
  }) => {
    const conversationdb = await db.query.conversation.findFirst({
      where: (conversation, { eq }) => eq(conversation.id, conversationId),
      with: {
        users: true,
      },
    });

    if (
      (conversationdb?.isGroup &&
        conversationdb.users.find((user) => user.userId === userId)?.isOwner) ||
      (!conversationdb?.isGroup &&
        conversationdb?.users.some((user) => user.userId === userId))
    ) {
      await db.delete(conversation).where(eq(conversation.id, conversationId));

      revalidatePath("/conversations", "layout");

      return conversationdb;
    } else {
      throw new Error("You don't have permission to delete this conversation");
    }
  }
);
