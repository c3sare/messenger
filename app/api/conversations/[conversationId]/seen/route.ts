import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import { db } from "@/drizzle";
import { pusherServer } from "@/lib/pusher";
import { messageRead } from "@/drizzle/schema";

interface IParams {
  conversationId: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();

    const conversationId = parseInt(params.conversationId);

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const conversation = await db.query.conversation.findFirst({
      where: (conversation, { eq }) => eq(conversation.id, conversationId),
      with: {
        messages: {
          with: {
            seenBy: true,
          },
        },
        users: true,
      },
    });

    if (!conversation) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const lastMessage = conversation.messages.at(-1);

    if (!lastMessage) {
      return NextResponse.json(conversation);
    }

    await db
      .insert(messageRead)
      .values({
        userId: currentUser.id,
        messageId: lastMessage.id,
      })
      .onConflictDoNothing();

    const { seenBy, ...updateMessage } = (await db.query.message.findFirst({
      where: (message, { eq }) => eq(message.id, lastMessage.id),
      with: {
        sender: true,
        seenBy: true,
      },
    }))!;

    const seenIds = seenBy.map((item) => item.userId);

    await pusherServer.trigger(currentUser.id, "conversation:update", {
      id: conversationId,
      messages: [{ ...updateMessage, seenIds }],
    });

    if (seenIds.indexOf(currentUser.id) !== -1) {
      return NextResponse.json(conversation);
    }

    await pusherServer.trigger(
      `conversation-${conversationId}`,
      "message:update",
      {
        ...updateMessage,
        seenIds,
      }
    );

    return NextResponse.json({ ...updateMessage, seenIds });
  } catch (error: any) {
    console.log(error, "ERROR_MESSAGES_SEEN");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
