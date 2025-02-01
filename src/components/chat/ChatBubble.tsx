import { Message } from "@/types/chat";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatBubbleProps {
  message: Message;
  isAgent?: boolean;
}

interface ImageGalleryProps {
  images: { url: string; description?: string }[];
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  if (!images.length) return null;

  return (
    <div className={`grid gap-1 mt-2 ${
      images.length === 1 ? 'grid-cols-1' : 
      images.length === 2 ? 'grid-cols-2' :
      'grid-cols-3'
    }`}>
      {images.map((image, index) => (
        <div 
          key={index}
          className={`relative aspect-square overflow-hidden rounded-lg ${
            images.length === 1 ? 'aspect-video' : ''
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
  );
};

export const ChatBubble = ({ message, isAgent = false }: ChatBubbleProps) => {
  const bubbleClass = isAgent
    ? "bg-chat-bubble-agent dark:bg-chat-bubble-dark-agent"
    : "bg-chat-bubble-user dark:bg-chat-bubble-dark-user ml-auto";

  const textColor = isAgent
    ? "text-gray-800 dark:text-gray-100"
    : "text-gray-800 dark:text-gray-100";

  return (
    <div className={`flex flex-col max-w-[85%] ${isAgent ? "" : "items-end"}`}>
      <div
        className={`rounded-lg px-3 py-2 ${bubbleClass} relative animate-slide-in`}
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
                <ImageGallery images={message.metadata.gallery.images} />
              )}
            </>
          )}
          {message.type === "audio" && (
            <div className="flex items-center gap-2 min-w-[240px]">
              <audio src={message.content} controls className="w-full" />
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