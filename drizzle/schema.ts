import { sql } from "drizzle-orm";
import { pgTable, primaryKey } from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("user", (t) => ({
  id: t
    .text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: t.text("name"),
  email: t.text("email").notNull(),
  hashedPassword: t.text("hashed_password"),
  emailVerified: t.timestamp("emailVerified", { mode: "date" }),
  image: t.text("image"),
  createdAt: t
    .timestamp("uploaded_at", { mode: "date" })
    .notNull()
    .default(sql`now()`),
}));

export const accounts = pgTable(
  "account",
  (t) => ({
    userId: t
      .text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: t.text("type").$type<AdapterAccountType>().notNull(),
    provider: t.text("provider").notNull(),
    providerAccountId: t.text("providerAccountId").notNull(),
    refresh_token: t.text("refresh_token"),
    access_token: t.text("access_token"),
    expires_at: t.integer("expires_at"),
    token_type: t.text("token_type"),
    scope: t.text("scope"),
    id_token: t.text("id_token"),
    session_state: t.text("session_state"),
  }),
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ]
);

export const sessions = pgTable("session", (t) => ({
  sessionToken: t.text("sessionToken").primaryKey(),
  userId: t
    .text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: t.timestamp("expires", { mode: "date" }).notNull(),
}));

export const verificationTokens = pgTable(
  "verificationToken",
  (t) => ({
    identifier: t.text("identifier").notNull(),
    token: t.text("token").notNull(),
    expires: t.timestamp("expires", { mode: "date" }).notNull(),
  }),
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
);

export const conversationUsers = pgTable(
  "conversation_user",
  (t) => ({
    conversationId: t
      .integer("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    userId: t
      .text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    joinedAt: t.timestamp("joined_at", { mode: "date" }).notNull().defaultNow(),
  }),
  (t) => [primaryKey({ columns: [t.conversationId, t.userId] })]
);

export const conversations = pgTable("conversation", (t) => ({
  id: t.serial("id").notNull().primaryKey(),
  lastMessageAt: t.timestamp("last_message_at", { mode: "date" }),
  name: t.text("name"),
  isGroup: t.boolean("is_group"),
  ownerId: t
    .text("owner_id")
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: t.timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
}));

export const messages = pgTable("message", (t) => ({
  id: t.serial("id").notNull().primaryKey(),
  body: t.text("body"),
  image: t.text("image"),
  senderId: t
    .text("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  conversationId: t
    .integer("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  createdAt: t.timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
}));

export const messageReads = pgTable(
  "message_read",
  (t) => ({
    messageId: t
      .integer("message_id")
      .notNull()
      .references(() => messages.id, { onDelete: "cascade" }),
    userId: t
      .text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  }),
  (t) => [primaryKey({ columns: [t.messageId, t.userId] })]
);
