import { auth } from "@/auth";
import { createSafeActionClient } from "next-safe-action";
import { valibotAdapter } from "next-safe-action/adapters/valibot";
export const action = createSafeActionClient({
  validationAdapter: valibotAdapter(),
});

export const authAction = createSafeActionClient().use(async ({ next }) => {
  const session = await auth();

  const user = session?.user;

  if (!user) throw new Error("Not authenticated");

  return next({ ctx: { user } });
});
