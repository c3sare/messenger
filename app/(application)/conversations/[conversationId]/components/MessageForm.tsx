"use client";

import useConversation from "@/hooks/useConversation";
import { CldUploadButton } from "next-cloudinary";
import { CameraIcon, SendHorizonalIcon } from "lucide-react";
import { useZodForm } from "@/hooks/useZodForm";
import { z } from "zod/mini";
import { Form } from "@/components/ui/form";
import { createMessage } from "@/actions/mutations/createMessage";

const MessageForm = () => {
  const { conversationId } = useConversation();

  const form = useZodForm({
    schema: z.object({
      message: z.string(),
    }),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    form.setValue("message", "", { shouldValidate: true });
    await createMessage({
      conversationId: conversationId!,
      body: data.message,
    });
  });

  return (
    <div className="p-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onSuccess={async (result) => {
          if (
            typeof result.info === "undefined" ||
            typeof result.info === "string"
          )
            return;

          await createMessage({
            conversationId: conversationId!,
            image: result?.info?.secure_url,
          });
        }}
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      >
        <CameraIcon size={30} className="text-sky-500" />
      </CldUploadButton>
      <Form {...form}>
        <form
          onSubmit={onSubmit}
          className="flex items-center gap-2 lg:gap-4 w-full"
        >
          <div className="relative w-full">
            <input
              id="message"
              type="text"
              autoComplete="message"
              {...form.register("message", { required: true })}
              placeholder="Write a message!"
              className="text-black font-light py-2 px-4 bg-neutral-100 w-full rounded-full focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-full p-2 bg-sky-500 hover:bg-sky-600 transition"
          >
            <SendHorizonalIcon size={18} className="text-white" />
          </button>
        </form>
      </Form>
    </div>
  );
};

export default MessageForm;
