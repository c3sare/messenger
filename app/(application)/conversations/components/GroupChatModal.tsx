"use client";

import { FormInput } from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { users } from "@/drizzle/schema";
import { useZodForm } from "@/hooks/useZodForm";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

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
      members: z.array(z.string()),
    }),
    defaultValues: {
      name: "",
      members: [],
    },
  });

  const members = form.watch("members");

  const onSubmit = form.handleSubmit(async (data) => {
    await axios
      .post(`/api/conversations`, {
        ...data,
        isGroup: true,
      })
      .then(() => {
        router.refresh();
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
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
              {/* <FormSelect
                disabled={form.isLoading}
                name="members"
                label="Members"
                options={users.map((user) => ({
                  value: user.id,
                  label: user.name ?? "Empty",
                }))}
                onChange={(value) =>
                  form.setValue("members", value, { shouldValidate: true })
                }
                value={members}
              /> */}
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
