"use client";

import { FormInput } from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { users } from "@/drizzle/schema";
import { useZodForm } from "@/hooks/useZodForm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { FormMultiSelect } from "@/components/form/FormMultiSelect";
import { createConversation } from "@/actions/mutations/createConversation";

type GroupChatModalProps = {
  users: (typeof users.$inferSelect)[];
};

const GroupChatModal: React.FC<GroupChatModalProps> = ({
  users,
}) => {
  const router = useRouter();

  const form = useZodForm({
    schema: z.object({
      name: z.string().min(3),
      members: z.array(z.string()).min(1),
    }),
    defaultValues: {
      name: "",
      members: [],
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await createConversation(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Create a group chat
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Create a chat with more than 2 people.
            </p>
            <div className="mt-10 flex flex-col gap-y-8">
              <FormInput
                control={form.control}
                label="Name"
                name="name"
                disabled={form.isLoading}
              />
              <FormMultiSelect
                control={form.control}
                label="Members"
                name="members"
                options={users.map((user) => ({
                  value: user.id,
                  label: user.name ?? "Empty",
                }))}
                disabled={form.isLoading}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button disabled={form.isLoading} type="submit">
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default GroupChatModal;
