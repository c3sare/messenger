import { auth } from "@/auth";
import { pusherServer } from "@/lib/pusher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) {
    return new NextResponse(null, { status: 401 });
  }

  const body = await request.text();

  const [socketId, channel] = body.split("&").map((str) => str.split("=")[1]);

  const data = {
    user_id: userId,
  };

  const authResponse = pusherServer.authorizeChannel(socketId, channel, data);

  return NextResponse.json(authResponse);
}
