import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ImageGalleryProps {
  images: {
    url: string;
    description?: string;
  }[];
  layout?: "grid" | "carousel";
}

export const ImageGallery = ({ images, layout = "grid" }: ImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsOpen(true);
  };

  return (
    <div className="w-full max-w-3xl">
      {/* Grid view of images */}
      <div className={cn(
        "grid gap-2",
        layout === "grid" && images.length > 1 && "grid-cols-2",
        layout === "carousel" && "grid-cols-1"
      )}>
        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square overflow-hidden rounded-lg cursor-pointer"
            onClick={() => handleImageClick(index)}
          >
            <img
              src={image.url}
              alt={image.description || `Image ${index + 1}`}
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      {/* Modal for expanded view */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[90vw] h-[90vh] p-0 bg-black/90 border-none">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 z-50 text-white hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <Carousel
            className="w-full h-full"
            defaultSlide={selectedImageIndex}
            opts={{
              align: "center",
              loop: true,
            }}
          >
            <CarouselContent className="h-full">
              {images.map((image, index) => (
                <CarouselItem key={index} className="h-full flex items-center justify-center">
                  <div className="relative w-full h-full flex items-center justify-center p-4">
                    <img
                      src={image.url}
                      alt={image.description || `Image ${index + 1}`}
                      className="max-h-full max-w-full object-contain"
                    />
                    {image.description && (
                      <div className="absolute bottom-6 left-0 right-0 text-center text-white bg-black/50 py-2 px-4">
                        {image.description}
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </DialogContent>
      </Dialog>
    </div>
  );
};