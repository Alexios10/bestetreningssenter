import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import VisuallyHidden from "@/components/ui/VisuallyHidden";
import { X } from "lucide-react";

interface ImageModalProps {
  imageUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  imageUrl,
  isOpen,
  onClose,
}) => {
  if (!imageUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="p-0 border-none bg-transparent shadow-none">
        <VisuallyHidden>
          <DialogTitle>Forstørret kommentarbilde</DialogTitle>
          <DialogDescription>
            Dette er en forstørret visning av kommentarbildet.
          </DialogDescription>
        </VisuallyHidden>
        <div className="relative w-full max-h-[80vh] flex items-center justify-center bg-white">
          <img
            src={imageUrl}
            alt="Enlarged comment image"
            className="max-w-full max-h-[80vh] object-contain rounded-md shadow-xl"
          />
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-2 bg-black/70 text-white rounded-full hover:bg-black/90 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
