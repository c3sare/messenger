import { conversation, message, users } from "@/drizzle/schema";

type User = typeof users.$inferSelect;

type Message = typeof message.$inferSelect;

type Conversation = typeof conversation.$inferSelect;

export type FullMessageType = Message & {
  sender: User;
  seen: User[];
};

export type FullConversationType = Conversation & {
  users: User[];
  messages: FullMessageType[];
};
