import { Message } from "@/types/chat";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Play, Pause } from "lucide-react";
import { useState, useRef } from "react";

interface ChatBubbleProps {
  message: Message;
  isAgent?: boolean;
}

export const ChatBubble = ({ message, isAgent = false }: ChatBubbleProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const bubbleClass = isAgent
    ? "bg-chat-bubble-agent dark:bg-chat-bubble-dark-agent rounded-tr-none"
    : "bg-chat-bubble-user dark:bg-chat-bubble-dark-user ml-auto rounded-tl-none";

  const textColor = "text-gray-800 dark:text-gray-100";

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
    <div className={`flex flex-col max-w-[85%] ${isAgent ? "" : "items-end"}`}>
      <div
        className={`px-3 py-2 ${bubbleClass} relative animate-slide-in shadow-sm`}
      >
        <div className={`${textColor} text-sm`}>
          {message.type === "text" && (
            <>
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                className="prose dark:prose-invert max-w-none prose-sm"
              >
                {message.content}
              </ReactMarkdown>
              {message.metadata?.gallery?.images && (
                <div className="mt-2 space-y-1">
                  <div className={`grid gap-1 ${
                    message.metadata.gallery.images.length === 1 ? 'grid-cols-1' : 
                    message.metadata.gallery.images.length === 2 ? 'grid-cols-2' :
                    'grid-cols-3'
                  }`}>
                    {message.metadata.gallery.images.map((image: any, index: number) => (
                      <div 
                        key={index}
                        className={`relative overflow-hidden rounded-lg ${
                          message.metadata.gallery.images.length === 1 ? 'aspect-video' : 'aspect-square'
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={image.description || `Image ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          {message.type === "audio" && (
            <div className="flex items-center gap-2 min-w-[180px] max-w-[280px]">
              <button
                onClick={handlePlayPause}
                className="w-8 h-8 flex items-center justify-center bg-[#00A884] dark:bg-[#00A884] rounded-full text-white"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 ml-0.5" />
                )}
              </button>
              <div className="flex-1">
                <div className="w-full h-[4px] bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#00A884] dark:bg-[#00A884]"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-gray-500 min-w-[40px]">
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
          <span className="text-[11px] text-gray-500 float-right ml-2 mt-1">
            {format(new Date(message.timestamp), "h:mm a", { locale: es })}
          </span>
        </div>
      </div>
    </div>
  );
};