import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import { db } from "./drizzle";
import google from "next-auth/providers/google";
import github from "next-auth/providers/github";
import credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db as never),
  providers: [
    google,
    github,
    credentials({
      credentials: {
        email: {
          label: "Email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      authorize: async ({ email }) => {
        const user = await db.query.users.findFirst({
          where: {
            email: email!,
          },
        });

        if (!user) throw new Error("User not found");

        return user;
      },
    }),
  ],
  trustHost: true,
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
  pages: {
    signIn: "/conversations",
    signOut: "/",
    error: "/",
    newUser: "/conversations",
    verifyRequest: "/",
  },
  session: {
    strategy: "jwt",
  },
});
