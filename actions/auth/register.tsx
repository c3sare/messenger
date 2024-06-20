"use server";

import { db } from "@/drizzle";
import { users } from "@/drizzle/schema";
import { action } from "@/lib/safe-action";
import { registerSchema } from "@/validators/auth/registerSchema";
import bcrypt from "bcrypt-edge";

export const registerUser = action
  .schema(registerSchema)
  .action(async ({ parsedInput: { email, name, password } }) => {
    try {
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: "Something went wrong",
      } as const;
    }
    const existUser = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.email, email),
    });

    if (existUser)
      return {
        success: false,
        field: "email",
        message: "Email already exist",
      } as const;

    const user = await db
      .insert(users)
      .values({
        email,
        name,
        hashedPassword: bcrypt.hashSync(password, 10),
      })
      .returning();

    if (!user.length)
      return {
        success: false,
        message: "Something went wrong",
      } as const;

    return {
      success: true,
    } as const;
  });
