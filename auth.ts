import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import { db } from "./drizzle";
import google from "next-auth/providers/google";
import github from "next-auth/providers/github";
import credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
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
          where: (user, { eq }) => eq(user.email, email as string),
        });

        if (!user) throw new Error("User not found");

        return user;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id as string;
      }

      console.log("jwt callback");
      return token;
    },
    session: async ({ session, token }) => {
      if (token.id) {
        session.user.id = token.id as unknown as string;
      }

      console.log("session callback");

      return session;
    },
  },
  pages: {
    signIn: "/dashboard",
    signOut: "/",
    error: "/",
    newUser: "/dashboard",
    verifyRequest: "/",
  },
  session: {
    strategy: "jwt",
  },
});
