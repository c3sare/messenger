import useOtherUser from "@/hooks/useOtherUser";
import { conversation, users } from "@/drizzle/schema";
import { format } from "date-fns";
import { useMemo, useState } from "react";

import Avatar from "@/components/Avatar";
import ConfirmModal from "./ConfirmModal";
import AvatarGroup from "@/components/AvatarGroup";
import useActiveList from "@/hooks/useActiveList";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CrossIcon, TrashIcon } from "lucide-react";
import type { FullConversationType } from "@/types";

type ProfileDrawerProps = {
  data: FullConversationType;
  isOpen: boolean;
  onClose: () => void;
};

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  data,
  isOpen,
  onClose,
}) => {
  const otherUser = useOtherUser(data);
  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

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
    <>
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      />
      <Dialog>
        <DialogContent>
          <div className="fixed inset-0 bg-black bg-opacity-40" />
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-end">
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={onClose}
                          className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                        >
                          <span className="sr-only">Close panel</span>
                          <CrossIcon size={24} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-6 flex-1 px-4 sm:px-6">
                    <div className="flex flex-col items-center">
                      <div className="mb-2">
                        {data.isGroup ? (
                          <AvatarGroup users={data.users} />
                        ) : (
                          <Avatar user={otherUser} />
                        )}
                      </div>
                      <div>{title}</div>
                      <div className="text-sm text-gray-500">
                        {statusText}
                      </div>
                      <div className="flex gap-10 my-8">
                        <div
                          onClick={() => setConfirmOpen(true)}
                          className="flex flex-col gap-3 items-center cursor-pointer hover:opacity-75"
                        >
                          <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                            <TrashIcon size={20} />
                          </div>
                          <div className="text-sm font-light text-neutral-600">
                            Delete
                          </div>
                        </div>
                      </div>
                      <div className="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
                        <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
                          {data.isGroup && (
                            <div>
                              <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                                Emails
                              </dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                {data.users
                                  .map((user) => user.email)
                                  .join(", ")}
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
                                  <time dateTime={joinedDate}>
                                    {joinedDate}
                                  </time>
                                </dd>
                              </div>
                            </>
                          )}
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileDrawer;
