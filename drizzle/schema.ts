import { sql } from "drizzle-orm";
import { pgTable, primaryKey } from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("user", (t) => ({
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: t.text(),
  email: t.text().notNull(),
  hashedPassword: t.text(),
  emailVerified: t.timestamp({ mode: "date" }),
  image: t.text(),
  createdAt: t
    .timestamp({ mode: "date" })
    .notNull()
    .default(sql`now()`),
}));

export const accounts = pgTable(
  "account",
  (t) => ({
    userId: t
      .text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: t.text().$type<AdapterAccountType>().notNull(),
    provider: t.text().notNull(),
    providerAccountId: t.text().notNull(),
    refresh_token: t.text(),
    access_token: t.text(),
    expires_at: t.integer(),
    token_type: t.text(),
    scope: t.text(),
    id_token: t.text(),
    session_state: t.text(),
  }),
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ]
);

export const sessions = pgTable("session", (t) => ({
  sessionToken: t.text().primaryKey(),
  userId: t
    .text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: t.timestamp({ mode: "date" }).notNull(),
}));

export const verificationTokens = pgTable(
  "verificationToken",
  (t) => ({
    identifier: t.text().notNull(),
    token: t.text().notNull(),
    expires: t.timestamp({ mode: "date" }).notNull(),
  }),
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
);

export const conversationUsers = pgTable(
  "conversation_user",
  (t) => ({
    conversationId: t
      .integer()
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    userId: t
      .text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    joinedAt: t.timestamp({ mode: "date" }).notNull().defaultNow(),
  }),
  (t) => [primaryKey({ columns: [t.conversationId, t.userId] })]
);

export const conversations = pgTable("conversation", (t) => ({
  id: t.serial().notNull().primaryKey(),
  lastMessageAt: t.timestamp({ mode: "date" }),
  name: t.text(),
  isGroup: t.boolean(),
  ownerId: t.text().references(() => users.id, { onDelete: "cascade" }),
  createdAt: t.timestamp({ mode: "date" }).notNull().defaultNow(),
}));

export const messages = pgTable("message", (t) => ({
  id: t.serial().notNull().primaryKey(),
  body: t.text(),
  image: t.text(),
  senderId: t
    .text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  conversationId: t
    .integer()
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  createdAt: t.timestamp({ mode: "date" }).notNull().defaultNow(),
}));

export const messageReads = pgTable(
  "message_read",
  (t) => ({
    messageId: t
      .integer()
      .notNull()
      .references(() => messages.id, { onDelete: "cascade" }),
    userId: t
      .text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  }),
  (t) => [primaryKey({ columns: [t.messageId, t.userId] })]
);
