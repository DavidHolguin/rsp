import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ImageGalleryProps {
  message: Message;
  isAgent?: boolean;
}

export const ImageGallery = ({ message, isAgent = false }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const images = message.metadata?.gallery?.images || [];

  if (!images.length) return null;

  return (
    <div className="space-y-2">
      <div className={cn(
        "grid grid-cols-3 gap-1",
        images.length === 1 && "grid-cols-1",
        images.length === 2 && "grid-cols-2"
      )}>
        {images.map((image: { url: string; description?: string }, index: number) => (
          <div
            key={index}
            className={cn(
              "relative aspect-square cursor-pointer overflow-hidden rounded-lg",
              images.length === 1 && "aspect-video"
            )}
            onClick={() => setSelectedImage(image.url)}
          >
            <img
              src={image.url}
              alt={image.description || `Image ${index + 1}`}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl bg-transparent border-0 p-0">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Full size"
              className="w-full h-full object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};