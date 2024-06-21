import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import { db } from "@/drizzle";
import { pusherServer } from "@/lib/pusher";
import { conversation } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

interface IParams {
  conversationId: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const conversationId = parseInt(params.conversationId);
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const existingConversation = await db.query.conversation.findFirst({
      where: (conversation, { eq }) => eq(conversation.id, conversationId),
      with: {
        users: true,
      },
    });

    if (!existingConversation) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const conversationExists = await db.query.conversationUser.findFirst({
      where: (conversationUser, { eq, and }) =>
        and(
          eq(conversationUser.conversationId, conversationId),
          eq(conversationUser.userId, currentUser.id)
        ),
    });

    if (!conversationExists) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const deleteConversation = (
      await db
        .delete(conversation)
        .where(eq(conversation.id, conversationExists.conversationId))
        .returning()
    ).at(0);

    if (!deleteConversation) throw new Error("Could not delete conversation");

    existingConversation.users.forEach((user) => {
      if (user.userId) {
        pusherServer.trigger(
          user.userId,
          "conversation:remove",
          existingConversation
        );
      }
    });

    return NextResponse.json(deleteConversation);
  } catch (error: any) {
    console.log(error, "ERROR_CONVERSATION_DELETE");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
