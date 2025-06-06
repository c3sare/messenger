import { auth } from "@/auth";
import { db } from "@/drizzle";
import { signOut } from "next-auth/react";
import { cache } from "react";

const getCurrentUser = cache(async () => {
  try {
    const session = await auth();

    const userId = session?.user?.id;

    if (!userId) {
      return null;
    }

    const currentUser = await db.query.users.findFirst({
      where: {
        id: userId,
      },
    });

    if (!currentUser) {
      await signOut();

      return null;
    }

    return currentUser;
  } catch (error) {
    console.error(error);
    return null;
  }
});

export default getCurrentUser;
