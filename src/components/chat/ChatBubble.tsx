import { Message } from "@/types/chat";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Play, Pause } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ImageGallery } from "./ImageGallery";

interface ChatBubbleProps {
  message: Message;
  isAgent?: boolean;
  onQuickReplyClick?: (text: string) => void;
}

export const ChatBubble = ({ message, isAgent = false, onQuickReplyClick }: ChatBubbleProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const bubbleClass = message.sender === "agent"
    ? "bg-[#202C33] dark:bg-[#202C33] rounded-[7px] rounded-tl-none max-w-[85%] self-start"
    : "bg-[#005C4B] dark:bg-[#005C4B] rounded-[7px] rounded-tr-none max-w-[85%] self-end";

  const textColor = "text-gray-100 dark:text-gray-100";

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col w-full px-2 mb-[2px]">
      <div className={bubbleClass}>
        <div className={`${textColor} text-sm px-[9px] py-[6px]`}>
          {message.type === "text" && (
            <>
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                className="prose dark:prose-invert max-w-none prose-sm prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-strong:text-white prose-em:text-gray-300"
              >
                {message.content}
              </ReactMarkdown>
              {message.metadata?.gallery?.images && (
                <div className="mt-2">
                  <ImageGallery 
                    images={message.metadata.gallery.images}
                    layout={message.metadata.gallery.layout || "grid"}
                  />
                </div>
              )}
              {message.metadata?.quickReplies && message.sender === "agent" && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.metadata.quickReplies.map((reply: string, index: number) => (
                    <Button
                      key={index}
                      variant="secondary"
                      size="sm"
                      className="bg-[#00A884] hover:bg-[#00A884]/90 text-white"
                      onClick={() => onQuickReplyClick?.(reply)}
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              )}
            </>
          )}
          {message.type === "audio" && (
            <div className="flex items-center gap-2 min-w-[180px] max-w-[280px] py-1">
              <button
                onClick={handlePlayPause}
                className="w-10 h-10 flex items-center justify-center bg-[#00A884] dark:bg-[#00A884] rounded-full text-white hover:bg-[#00A884]/90 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </button>
              <div className="flex-1">
                <div className="w-full h-[4px] bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white dark:bg-white"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-gray-300 min-w-[40px]">
                {formatTime(currentTime)}
              </span>
              <audio
                ref={audioRef}
                src={message.content}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            </div>
          )}
          <span className="text-[11px] text-gray-300 float-right ml-2 mt-1">
            {format(new Date(message.timestamp), "h:mm a", { locale: es })}
          </span>
        </div>
      </div>
    </div>
  );
};