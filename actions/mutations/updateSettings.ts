"use server";

import { db } from "@/drizzle";
import { users } from "@/drizzle/schema";
import { authAction } from "@/lib/safe-action";
import { settingSchema } from "@/validators/settingSchema";
import { eq } from "drizzle-orm";

export const updateSettings = authAction
  .schema(settingSchema)
  .action(async ({ parsedInput: { name, image }, ctx: { user } }) => {
    const update = await db
      .update(users)
      .set({
        name,
        image,
      })
      .where(eq(users.id, user.id!))
      .returning();

    if (!update.length) {
      return { success: false };
    }

    return { success: true };
  });
