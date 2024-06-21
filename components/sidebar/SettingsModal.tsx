import { users } from "@/drizzle/schema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { CldUploadButton } from "next-cloudinary";
import { toast } from "sonner";
import { FormInput } from "../form/FormInput";
import { useZodForm } from "@/hooks/useZodForm";
import { z } from "zod";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";

type SettingsModalProps = {
  currentUser: typeof users.$inferSelect;
  isOpen?: boolean;
  onClose: () => void;
};

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    setIsLoading(true);

    axios
      .post("/api/settings", data)
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setIsLoading(false));
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Profile
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Edit your public information.
              </p>
              <div className="mt-10 flex flex-col gap-y-8">
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
                      <Button disabled={isLoading} variant="secondary" type="button">
                        Change
                      </Button>
                    </CldUploadButton>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <Button disabled={isLoading} variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
                Save
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
