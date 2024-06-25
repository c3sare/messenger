import type getConversationById from "@/actions/getConversationById";

export type FullConversationType = NonNullable<
  Awaited<ReturnType<typeof getConversationById>>
>;

export type FullMessageType = FullConversationType["messages"][number];
