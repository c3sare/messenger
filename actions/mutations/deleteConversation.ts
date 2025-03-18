"use server";

import { db } from "@/drizzle";
import { conversations } from "@/drizzle/schema";
import { pusherServer } from "@/lib/pusher";
import { authAction } from "@/lib/safe-action";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as v from "valibot";

export const deleteConversation = authAction.schema(v.number()).action(
  async ({
    parsedInput: conversationId,
    ctx: {
      user: { id: userId },
    },
  }) => {
    const conversationdb = await db.query.conversations.findFirst({
      where: {
        id: conversationId,
      },
      with: {
        users: true,
      },
    });

    if (
      (conversationdb?.isGroup && conversationdb.ownerId === userId) ||
      (!conversationdb?.isGroup &&
        conversationdb?.users.some((user) => user.id === userId))
    ) {
      const deletedConversation = await db
        .delete(conversations)
        .where(eq(conversations.id, conversationId))
        .returning();

      pusherServer.trigger(
        conversationdb.users.map((item) => item.id),
        "conversation:remove",
        deletedConversation.at(0)
      );

      revalidatePath("/conversations");

      return redirect("/conversations");
    } else {
      throw new Error("You don't have permission to delete this conversation");
    }
  }
);
