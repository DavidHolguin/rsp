import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ImageGalleryProps {
  message: Message;
  isAgent?: boolean;
}

export const ImageGallery = ({ message, isAgent = false }: ImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const images = message.metadata?.gallery?.images || [];

  if (!images.length) return null;

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleClose = () => {
    setSelectedImageIndex(null);
  };

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
            onClick={() => handleImageClick(index)}
          >
            <img
              src={image.url}
              alt={image.description || `Image ${index + 1}`}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>
        ))}
      </div>

      <Dialog open={selectedImageIndex !== null} onOpenChange={handleClose}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] bg-black/90 border-0 p-0">
          <div className="relative w-full h-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-50 text-white hover:bg-white/20"
              onClick={handleClose}
            >
              <X className="h-6 w-6" />
            </Button>
            
            <Carousel
              opts={{
                startIndex: selectedImageIndex || 0,
                loop: true,
              }}
              className="w-full h-full"
            >
              <CarouselContent>
                {images.map((image: { url: string; description?: string }, index: number) => (
                  <CarouselItem key={index}>
                    <div className="flex items-center justify-center w-full h-full p-4">
                      <img
                        src={image.url}
                        alt={image.description || `Image ${index + 1}`}
                        className="max-w-full max-h-[85vh] object-contain rounded-lg"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              {images.length > 1 && (
                <>
                  <CarouselPrevious className="left-2 bg-white/10 hover:bg-white/20 border-0 text-white" />
                  <CarouselNext className="right-2 bg-white/10 hover:bg-white/20 border-0 text-white" />
                </>
              )}
            </Carousel>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};