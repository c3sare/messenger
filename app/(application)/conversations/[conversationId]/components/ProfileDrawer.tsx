import useOtherUser from "@/hooks/useOtherUser";
import { format } from "date-fns";
import { useMemo, useTransition } from "react";

import Avatar from "@/components/Avatar";
import AvatarGroup from "@/components/AvatarGroup";
import useActiveList from "@/stores/useActiveList";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { EllipsisIcon, TrashIcon } from "lucide-react";
import type { FullConversationType } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteConversation } from "@/actions/mutations/deleteConversation";
import getCurrentUser from "@/actions/getCurrentUser";
import { useShallow } from "zustand/shallow";
import { Button } from "@/components/ui/button";

type ProfileDrawerProps = {
  data: FullConversationType;
  currentUser: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;
};

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ data, currentUser }) => {
  const [isPending, startTransition] = useTransition();
  const otherUser = useOtherUser(data, currentUser);
  const members = useActiveList(useShallow((state) => state.members));
  const isActive = members.indexOf(otherUser.id) !== -1;

  const joinedDate = useMemo(() => {
    return format(new Date(otherUser.createdAt), "PP");
  }, [otherUser]);

  const title = useMemo(() => {
    return data.name || otherUser.name;
  }, [data.name, otherUser.name]);

  const statusText = useMemo(() => {
    if (data.isGroup) {
      return `${data.users.length} members`;
    }

    return isActive ? "Active" : "Offline";
  }, [data, isActive]);

  return (
    <Dialog>
      <DialogTrigger>
        <EllipsisIcon
          size={32}
          className="text-sky-500 cursor-pointer hover:text-sky-600 transition"
        />
      </DialogTrigger>
      <DialogContent className="mt-6 flex-1 px-4 sm:px-6">
        <div className="flex flex-col items-center">
          <div className="mb-2">
            {data.isGroup ? (
              <AvatarGroup users={data.users} />
            ) : (
              <Avatar user={otherUser} />
            )}
          </div>
          <div>{title}</div>
          <div className="text-sm text-gray-500">{statusText}</div>
          <div className="flex gap-10 my-8">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex flex-col gap-1 items-center h-auto"
                >
                  <div className="w-10 h-10 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center">
                    <TrashIcon className="size-4" />
                  </div>
                  <span className="text-destructive">Delete</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this conversation.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isPending}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    disabled={isPending}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/80"
                    onClick={(e) =>
                      startTransition(async () => {
                        e.preventDefault();
                        e.stopPropagation();
                        await deleteConversation(data.id);
                      })
                    }
                  >
                    Delete this conversation
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
            <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
              {data.isGroup && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                    Emails
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                    {data.users.map((user) => user.email).join(", ")}
                  </dd>
                </div>
              )}
              {!data.isGroup && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                    Email
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                    {otherUser.email}
                  </dd>
                </div>
              )}
              {!data.isGroup && (
                <>
                  <hr />
                  <div>
                    <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                      Joined
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                      <time dateTime={joinedDate}>{joinedDate}</time>
                    </dd>
                  </div>
                </>
              )}
            </dl>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDrawer;
