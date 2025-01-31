import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";
import { useEffect, useState } from "react";

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
            ? "bg-chat-agent rounded-tl-none"
            : "bg-chat-bubble rounded-tr-none"
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
        {message.type === "audio" && (
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full bg-primary text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </button>
            <div className="w-32 h-1 bg-gray-200 rounded">
              <div className="w-1/2 h-full bg-primary rounded"></div>
            </div>
            <span className="text-xs text-gray-500">0:30</span>
          </div>
        )}
      </div>
    </div>
  );
};