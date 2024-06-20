import { auth } from "@/auth";
import { db } from "@/drizzle";

const getUsers = async () => {
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) {
    return [];
  }

  try {
    const user = await db.query.users.findMany({
      orderBy: (user, { desc }) => desc(user.createdAt),
      where: (user, { not, eq }) => not(eq(user.id, userId)),
    });

    return user;
  } catch (error: any) {
    return [];
  }
};

export default getUsers;
