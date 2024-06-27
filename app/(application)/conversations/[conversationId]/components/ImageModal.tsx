import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";

type ImageModalProps = {
  isOpen?: boolean;
  onClose: () => void;
  src?: string | null;
};

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, src }) => {
  if (!src) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <Image alt="Image" className="object-cover" width={1000} height={1000} src={src} />
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
