import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";
import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { MapPin } from "lucide-react";

interface ChatBubbleProps {
  message: Message;
  isAgent?: boolean;
}

export const ChatBubble = ({ message, isAgent = false }: ChatBubbleProps) => {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (isAgent && message.content) {
      let index = 0;
      setDisplayText("");
      
      const interval = setInterval(() => {
        if (index < message.content.length) {
          setDisplayText((prev) => prev + message.content[index]);
          index++;
        } else {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, 30);

      return () => clearInterval(interval);
    } else {
      setDisplayText(message.content);
      setIsTyping(false);
    }
  }, [message.content, isAgent]);

  const renderGallery = () => {
    if (!message.metadata?.gallery?.images?.length) return null;
    
    return (
      <div className="w-full max-w-md mx-auto mt-2">
        <Carousel>
          <CarouselContent>
            {message.metadata.gallery.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-video">
                  <img
                    src={image.url}
                    alt={image.description || "Gallery image"}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {image.description && (
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-sm rounded-b-lg">
                      {image.description}
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    );
  };

  const renderLocation = () => {
    if (!message.metadata?.location) return null;

    return (
      <div className="mt-2 flex items-center gap-2 text-sm">
        <MapPin className="w-4 h-4" />
        <span>{message.metadata.location.address}</span>
      </div>
    );
  };

  const renderQuickReplies = () => {
    if (!message.metadata?.quickReplies?.length) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {message.metadata.quickReplies.map((reply, index) => (
          <button
            key={index}
            className="px-4 py-2 text-sm bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
            onClick={() => console.log("Quick reply clicked:", reply.action)}
          >
            {reply.text}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isAgent ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-3 animate-slide-in dark:text-white",
          isAgent
            ? "bg-chat-bubble-agent dark:bg-chat-bubble-dark-agent rounded-tl-none"
            : "bg-chat-bubble-user dark:bg-chat-bubble-dark-user rounded-tr-none"
        )}
      >
        {message.type === "text" && (
          <p className="text-sm whitespace-pre-wrap break-words">
            {displayText}
            {isTyping && (
              <span className="inline-flex ml-2">
                <span className="w-1 h-1 bg-gray-500 rounded-full mx-0.5 animate-typing-dot" style={{ animationDelay: "0s" }}></span>
                <span className="w-1 h-1 bg-gray-500 rounded-full mx-0.5 animate-typing-dot" style={{ animationDelay: "0.2s" }}></span>
                <span className="w-1 h-1 bg-gray-500 rounded-full mx-0.5 animate-typing-dot" style={{ animationDelay: "0.4s" }}></span>
              </span>
            )}
          </p>
        )}
        {message.type === "image" && (
          <img
            src={message.content}
            alt="Chat image"
            className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          />
        )}
        {message.type === "gallery" && renderGallery()}
        {message.type === "location" && renderLocation()}
        {renderQuickReplies()}
      </div>
    </div>
  );
};