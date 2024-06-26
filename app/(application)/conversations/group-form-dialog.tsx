import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { UserPlusIcon } from "lucide-react";
import GroupChatModal from "./components/GroupChatModal";
import getUsers from "@/actions/getUsers";

export const GroupFormDialog = async () => {
  const users = await getUsers();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition">
          <UserPlusIcon size={20} />
        </button>
      </DialogTrigger>
      <DialogContent>
        <GroupChatModal users={users} />
      </DialogContent>
    </Dialog>
  );
};
