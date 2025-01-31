import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";
import { useEffect, useState, useRef } from "react";
import { Play, Pause, Check } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ImageGallery } from "./ImageGallery";

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
      <div className={cn(
        "flex items-center gap-3 min-w-[280px] p-2 rounded-lg",
        isAgent 
          ? "bg-chat-bubble-dark-agent" 
          : "bg-chat-bubble-dark-user"
      )}>
        <audio ref={audioRef} src={message.content} className="hidden" />
        <button
          onClick={toggleAudio}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
            "bg-chat-audio-waveform dark:bg-chat-audio-dark-waveform text-white hover:opacity-90"
          )}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
        </button>
        
        <div className="flex-1">
          <div
            ref={progressRef}
            className="h-[4px] bg-gray-600/50 dark:bg-gray-600/30 rounded-full cursor-pointer overflow-hidden"
            onClick={handleProgressClick}
          >
            <div
              className={cn(
                "h-full rounded-full transition-all",
                "bg-chat-audio-waveform dark:bg-chat-audio-dark-waveform"
              )}
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1 text-gray-200">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    );
  };

  const formatMessageTime = (timestamp: number) => {
    return format(new Date(timestamp), "h:mm a", { locale: es });
  };

  return (
    <div
      className={cn(
        "flex w-full mb-2",
        isAgent ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] p-2 relative",
          isAgent
            ? "bg-chat-bubble-agent dark:bg-chat-bubble-dark-agent rounded-lg rounded-tl-none"
            : "bg-chat-bubble-user dark:bg-chat-bubble-dark-user rounded-lg rounded-tr-none"
        )}
      >
        {message.type === "text" && (
          <div className="space-y-1">
            <p className="text-sm whitespace-pre-wrap break-words text-[#111B21] dark:text-white">
              {displayText}
              {isTyping && (
                <span className="inline-flex ml-2">
                  <span className="w-1 h-1 bg-gray-500 rounded-full mx-0.5 animate-typing-dot" style={{ animationDelay: "0s" }}></span>
                  <span className="w-1 h-1 bg-gray-500 rounded-full mx-0.5 animate-typing-dot" style={{ animationDelay: "0.2s" }}></span>
                  <span className="w-1 h-1 bg-gray-500 rounded-full mx-0.5 animate-typing-dot" style={{ animationDelay: "0.4s" }}></span>
                </span>
              )}
            </p>
            {message.metadata?.gallery && <ImageGallery message={message} isAgent={isAgent} />}
            <div className="flex items-center justify-end gap-1">
              <span className="text-[11px] text-[#667781] dark:text-gray-400">
                {formatMessageTime(message.timestamp)}
              </span>
              <div className="flex -space-x-1">
                <Check className="w-3 h-3 text-[#667781] dark:text-gray-400" />
                <Check className="w-3 h-3 text-[#667781] dark:text-gray-400" />
              </div>
            </div>
          </div>
        )}
        {message.type === "audio" && (
          <div className="space-y-1">
            {renderAudioPlayer()}
            <div className="flex items-center justify-end gap-1">
              <span className="text-[11px] text-[#667781] dark:text-gray-400">
                {formatMessageTime(message.timestamp)}
              </span>
              <div className="flex -space-x-1">
                <Check className="w-3 h-3 text-[#667781] dark:text-gray-400" />
                <Check className="w-3 h-3 text-[#667781] dark:text-gray-400" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};