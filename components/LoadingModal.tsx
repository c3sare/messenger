"use client";

import { Loader2Icon } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog"

const LoadingModal = () => {
  return (
    <DialogPrimitive.Root open={true}>
      <DialogPrimitive.DialogPortal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-white/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="flex items-center justify-center fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] gap-4 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <Loader2Icon className="animate-spin" size={40} color="#0284c7" />
        </DialogPrimitive.Content>
      </DialogPrimitive.DialogPortal>
    </DialogPrimitive.Root>
  );
};

export default LoadingModal;
