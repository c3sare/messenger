"use client";

import { users } from "@/drizzle/schema";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CldUploadButton } from "next-cloudinary";
import { toast } from "sonner";
import { FormInput } from "../form/FormInput";
import { useZodForm } from "@/hooks/useZodForm";
import { z } from "zod";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { updateSettings } from "@/actions/mutations/updateSettings";

type SettingsModalProps = {
  currentUser: typeof users.$inferSelect;
};

const SettingsModal: React.FC<SettingsModalProps> = ({
  currentUser,
}) => {
  const form = useZodForm({
    schema: z.object({
      name: z.string().min(3).max(30),
      image: z.string().url().optional().nullable(),
    }),
    defaultValues: {
      name: currentUser?.name ?? "",
      image: currentUser?.image,
    },
  });

  const image = form.watch("image");

  const handleUpload = (result: any) => {
    form.setValue("image", result?.info?.secure_url, {
      shouldValidate: true,
    });
  };

  const onSubmit = form.handleSubmit(async (data) => {
    const request = await updateSettings(data);

    if (request?.data?.success) {
      toast.success("Settings updated successfully!");
    } else {
      toast.error("Something went wrong!");
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="border-b border-gray-900/10 pb-6">
          <div className="flex flex-col gap-y-8">
            <FormInput
              control={form.control}
              disabled={form.isLoading}
              label="Name"
              name="name"
            />
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Photo
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <Image
                  width={48}
                  height={48}
                  className="rounded-full"
                  src={
                    image || currentUser?.image || "/images/placeholder.jpg"
                  }
                  alt="Avatar"
                />
                <CldUploadButton
                  options={{ maxFiles: 1 }}
                  onUpload={handleUpload}
                  uploadPreset="g2efbtdv"
                >
                  <Button disabled={form.isLoading} variant="secondary" type="button">
                    Change
                  </Button>
                </CldUploadButton>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button disabled={form.isLoading} type="submit">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SettingsModal;
