import { auth } from "@/auth";
import { createSafeActionClient } from "next-safe-action";
export const action = createSafeActionClient();

export const authAction = createSafeActionClient().use(async ({ next }) => {
  const session = await auth();

  const user = session?.user;

  if (!user) throw new Error("Not authenticated");

  return next({ ctx: { user } });
});
