import { db } from "@/drizzle";
import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import { conversation, message, messageRead } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const bodyJson = await request.json();
    const { message: body, image, conversationId } = bodyJson;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const newMessage = (
      await db
        .insert(message)
        .values({
          body,
          image,
          conversationId,
          senderId: currentUser.id,
        })
        .returning()
    ).at(0);

    if (!newMessage) throw new Error("Message not created");

    await db.insert(messageRead).values({
      userId: currentUser.id,
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

    await pusherServer.trigger(conversationId, "messages:new", newMessage);

    const lastMessage = updatedConversation.messages.at(-1);

    updatedConversation.users.map((user) => {
      pusherServer.trigger(user.userId, "conversation:update", {
        id: conversationId,
        messages: [lastMessage],
      });
    });

    return NextResponse.json(newMessage);
  } catch (error: any) {
    console.log(error, "ERROR_MESSAGES");
    return new NextResponse("InternalError", { status: 500 });
  }
}
