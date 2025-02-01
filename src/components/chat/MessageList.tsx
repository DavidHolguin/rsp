import { Message } from "@/types/chat";
import { ChatBubble } from "./ChatBubble";

interface MessageListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const MessageList = ({ messages, messagesEndRef }: MessageListProps) => {
  return (
    <div 
      className="flex-1 overflow-y-auto p-4 space-y-4 mt-[56px] mb-[72px] scrollbar-none overscroll-y-contain"
      style={{
        background: `linear-gradient(rgba(11, 20, 26, 0.95), rgba(11, 20, 26, 0.95)), url(https://static.whatsapp.net/rsrc.php/v4/yl/r/gi_DckOUM5a.png)`,
        backgroundSize: 'contain',
        backgroundRepeat: 'repeat',
        WebkitOverflowScrolling: 'touch', // For iOS smooth scrolling
        msOverflowStyle: 'none',  // Hide scrollbar in IE/Edge
        scrollbarWidth: 'none',   // Hide scrollbar in Firefox
      }}
    >
      {messages.map((message) => (
        <ChatBubble
          key={message.id}
          message={message}
          isAgent={message.sender === "agent"}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};