import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { UserPlusIcon } from "lucide-react";
import GroupChatModal from "./components/GroupChatModal";
import getUsers from "@/actions/getUsers";
import { Button } from "@/components/ui/button";

export const GroupFormDialog = async () => {
  const users = await getUsers();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <UserPlusIcon className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <GroupChatModal users={users} />
      </DialogContent>
    </Dialog>
  );
};
