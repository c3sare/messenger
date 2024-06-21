"use client";

import { Loader2Icon } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";

const LoadingModal = () => {
  return (
    <Dialog open={true}>
      <DialogContent className="flex justify-center items-center">
        <Loader2Icon className="animate-spin" size={40} color="#0284c7" />
      </DialogContent>
    </Dialog>
  );
};

export default LoadingModal;
