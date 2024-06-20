import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  hashedPassword: text("hashed_password"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("uploaded_at", { mode: "date" })
    .notNull()
    .default(sql`now()`),
});

export const userRelations = relations(users, ({ many }) => ({
  conversations: many(conversationUser),
  messages: many(message),
  seenMessages: many(messageRead),
  accounts: many(accounts),
}));

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const conversationUser = pgTable(
  "conversation_user",
  {
    conversationId: integer("conversation_id")
      .notNull()
      .references(() => conversation.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => ({
    primaryKey: primaryKey({ columns: [t.conversationId, t.userId] }),
  })
);

export const conversationUserRelations = relations(
  conversationUser,
  ({ one }) => ({
    conversation: one(conversation, {
      fields: [conversationUser.conversationId],
      references: [conversation.id],
    }),
    user: one(users, {
      fields: [conversationUser.userId],
      references: [users.id],
    }),
  })
);

export const conversation = pgTable("conversation", {
  id: serial("id").notNull().primaryKey(),
  url: text("url").notNull(),
  lastMessageAt: timestamp("last_message_at", { mode: "date" }),
  name: text("name"),
  isGroup: boolean("is_group"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const conversationRelations = relations(conversation, ({ many }) => ({
  users: many(conversationUser),
  messages: many(message),
}));

export const message = pgTable("message", {
  id: serial("id").notNull().primaryKey(),
  body: text("body"),
  image: text("image"),
  senderId: text("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  conversationId: integer("conversation_id")
    .notNull()
    .references(() => conversation.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const messageRelations = relations(message, ({ one, many }) => ({
  sender: one(users, { fields: [message.senderId], references: [users.id] }),
  conversation: one(conversation, {
    fields: [message.conversationId],
    references: [conversation.id],
  }),
  seenBy: many(messageRead),
}));

export const messageRead = pgTable(
  "message_read",
  {
    messageId: integer("message_id")
      .notNull()
      .references(() => message.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (t) => ({
    primaryKey: primaryKey({ columns: [t.messageId, t.userId] }),
  })
);

export const messageReadRelations = relations(messageRead, ({ one }) => ({
  message: one(message, {
    fields: [messageRead.messageId],
    references: [message.id],
  }),
  user: one(users, { fields: [messageRead.userId], references: [users.id] }),
}));
