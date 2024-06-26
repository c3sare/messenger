import getUsers from "@/actions/getUsers";
import UserBox from "./UserBox";

const UserList = async () => {
  const users = await getUsers();

  return users.map((item) => (
    <UserBox key={item.id} data={item} />
  ))
};

export default UserList;
