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
        <div className="size-80">
          <Image alt="Image" className="object-cover" fill src={src} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
