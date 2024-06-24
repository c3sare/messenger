import { users } from "@/drizzle/schema";
import getUsers from "@/actions/getUsers";
import Sidebar from "@/components/sidebar/Sidebar";
import UserList from "./components/UserList";

const UsersLayout: React.FC<React.PropsWithChildren> = async ({ children }) => {
  const userss = (await getUsers()) as (typeof users.$inferSelect)[];

  return (
    <Sidebar>
      <div className="h-full">
        <UserList items={userss} />
        {children}
      </div>
    </Sidebar>
  );
};

export default UsersLayout;
