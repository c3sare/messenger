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
      orderBy: {
        createdAt: "desc",
      },
      where: {
        NOT: {
          id: userId,
        },
      },
    });

    return user;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getUsers;
