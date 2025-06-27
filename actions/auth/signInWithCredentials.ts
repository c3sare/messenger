"use server";

import { signIn } from "@/auth";
import { db } from "@/drizzle";
import { action } from "@/lib/safe-action";
import { signInSchema } from "@/validators/auth/signInSchema";
import bcrypt from "bcryptjs";

export const signInWithCredentials = action
  .schema(signInSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    const user = await db.query.users.findFirst({
      where: {
        email,
      },
    });

    if (
      !user ||
      !user.hashedPassword ||
      !bcrypt.compareSync(password, user.hashedPassword)
    )
      return {
        success: false,
        message: "Credentials are invalid",
      };

    await signIn("credentials", {
      email,
      redirectTo: "/conversations",
    });
  });
