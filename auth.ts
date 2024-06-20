import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import { db } from "./drizzle";
import google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [google],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id as string;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token.id) {
        session.user.id = token.id as unknown as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
