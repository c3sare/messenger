import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import { db } from "@/drizzle";
import { pusherServer } from "@/lib/pusher";
import { conversation, conversationUser } from "@/drizzle/schema";
import { z } from "zod";
import { and, eq, inArray, isNull, or, sql } from "drizzle-orm";

const schema = z.object({
  userId: z.string(),
  isGroup: z.boolean(),
  members: z.array(z.object({ value: z.string() })),
  name: z.string(),
});

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { userId, isGroup, members, name } = schema.parse(body);

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse("Invalid data", { status: 400 });
    }

    if (isGroup) {
      const newConversation = (
        await db
          .insert(conversation)
          .values({
            name,
            isGroup,
          })
          .returning()
      ).at(0);

      if (!newConversation) throw new Error("Failed to create conversation");

      const conversationUsers = await db
        .insert(conversationUser)
        .values([
          ...members.map((member: { value: string }) => ({
            userId: member.value,
            conversationId: newConversation.id,
          })),
        ])
        .returning();

      conversationUsers.forEach((user) => {
        pusherServer.trigger(user.userId, "conversation:new", newConversation);
      });

      return NextResponse.json(newConversation);
    }

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
            inArray(conversationUser.userId, [currentUser.id, userId]),
            or(eq(conversation.isGroup, false), isNull(conversation.isGroup))
          )
        )
    ).at(0);

    if (existingConveration) {
      return NextResponse.json(existingConveration);
    }

    const newConversation = (
      await db.insert(conversation).values({}).returning()
    ).at(0);

    if (!newConversation) throw new Error("Failed to create conversation");

    const users = await db
      .insert(conversationUser)
      .values([
        {
          userId: currentUser.id,
          conversationId: newConversation.id,
        },
        {
          userId,
          conversationId: newConversation.id,
        },
      ])
      .returning();

    users.map((user) => {
      pusherServer.trigger(user.userId, "conversation:new", newConversation);
    });

    return NextResponse.json({ ...newConversation, users });
  } catch (error: any) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
