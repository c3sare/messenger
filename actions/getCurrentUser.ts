import { auth } from "@/auth";
import { db } from "@/drizzle";

const getCurrentUser = async () => {
  try {
    const session = await auth();

    const userId = session?.user?.id;

    if (!userId) {
      return null;
    }

    const currentUser = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.id, userId),
    });

    if (!currentUser) {
      return null;
    }

    return currentUser;
  } catch (error: any) {
    return null;
  }
};

export default getCurrentUser;
