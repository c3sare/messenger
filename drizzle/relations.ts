import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (t) => ({
  users: {
    conversations: t.many.conversations({
      from: t.users.id.through(t.conversationUsers.userId),
      to: t.conversations.id.through(t.conversationUsers.conversationId),
    }),
    messages: t.many.messages({
      from: t.users.id,
      to: t.messages.senderId,
    }),
    seenMessages: t.many.messageReads({
      from: t.users.id,
      to: t.messageReads.userId,
    }),
  },
  conversations: {
    users: t.many.users({
      from: t.conversations.id.through(t.conversationUsers.conversationId),
      to: t.users.id.through(t.conversationUsers.userId),
    }),
    messages: t.many.messages({
      from: t.conversations.id,
      to: t.messages.conversationId,
    }),
    owner: t.one.users({
      from: t.conversations.ownerId,
      to: t.users.id,
    }),
  },
  messages: {
    seenBy: t.many.users({
      from: t.messages.id.through(t.messageReads.messageId),
      to: t.users.id.through(t.messageReads.userId),
    }),
    sender: t.one.users({
      from: t.messages.senderId,
      to: t.users.id,
    }),
  },
  messageReads: {},
}));
