import { Suspense } from "react";
import { GroupFormDialog } from "./group-form-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Conversations } from "./conversations";
import { Aside } from "./aside";

type Props = {
  children?: React.ReactNode;
  params: {
    conversationId?: string;
  };
};

const ConversationsLayout = ({
  children,
}: Props) => (
  <>
    <Aside>
      <div className="px-5">
        <div className="flex justify-between mb-4 pt-4">
          <div className="text-2xl font-bold text-neutral-800">Messages</div>
          <Suspense fallback={<Skeleton className="bg-neutral-200 size-9" />}>
            <GroupFormDialog />
          </Suspense>
        </div>
        <Suspense
          fallback={[...Array(6)].map((_item, i) => (
            <Skeleton
              key={i}
              className="bg-neutral-200 my-2 w-full h-[74px] rounded-lg"
            />
          ))}
        >
          <Conversations />
        </Suspense>
      </div>
    </Aside>
    <div className="h-full">{children}</div>
  </>
);

export default ConversationsLayout;
