import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";
import { useEffect, useState, useRef } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { MapPin, Play, Pause } from "lucide-react";

interface ChatBubbleProps {
  message: Message;
  isAgent?: boolean;
}

export const ChatBubble = ({ message, isAgent = false }: ChatBubbleProps) => {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isAgent && message.content && message.type === "text") {
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
  }, [message.content, isAgent, message.type]);

  useEffect(() => {
    if (message.type === "audio" && audioRef.current) {
      audioRef.current.addEventListener("loadedmetadata", () => {
        setDuration(audioRef.current?.duration || 0);
      });

      audioRef.current.addEventListener("timeupdate", () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });

      audioRef.current.addEventListener("ended", () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
    }
  }, [message.type]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const time = percent * duration;
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const renderAudioPlayer = () => {
    if (message.type !== "audio") return null;

    return (
      <div className="flex items-center gap-3 min-w-[200px]">
        <audio ref={audioRef} src={message.content} className="hidden" />
        <button
          onClick={toggleAudio}
          className={cn(
            "p-2 rounded-full transition-colors",
            isAgent 
              ? "bg-[#1F2C34] text-white hover:bg-[#1F2C34]/90" 
              : "bg-[#005C4B] text-white hover:bg-[#005C4B]/90"
          )}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        
        <div className="flex-1">
          <div
            ref={progressRef}
            className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer"
            onClick={handleProgressClick}
          >
            <div
              className={cn(
                "h-full rounded-full transition-all",
                isAgent ? "bg-[#1F2C34]" : "bg-[#005C4B]"
              )}
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1 text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        {message.metadata?.transcription && (
          <div className="mt-2 text-xs text-gray-500">
            {message.metadata.transcription}
          </div>
        )}
      </div>
    );
  };

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
          "max-w-[80%] rounded-lg p-3 animate-slide-in",
          isAgent
            ? "bg-[#1F2C34] text-white rounded-tl-none"
            : "bg-[#005C4B] text-white rounded-tr-none"
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
        {message.type === "audio" && renderAudioPlayer()}
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
