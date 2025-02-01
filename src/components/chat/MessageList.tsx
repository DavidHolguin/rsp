import { Message } from "@/types/chat";
import { ChatBubble } from "./ChatBubble";

interface MessageListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const MessageList = ({ messages, messagesEndRef }: MessageListProps) => {
  return (
    <div 
      className="flex-1 overflow-y-auto p-4 space-y-4 mt-[56px] mb-[72px] scrollbar-none touch-pan-y"
      style={{
        background: `linear-gradient(rgba(11, 20, 26, 0.95), rgba(11, 20, 26, 0.95)), url(https://static.whatsapp.net/rsrc.php/v4/yl/r/gi_DckOUM5a.png)`,
        backgroundSize: 'contain',
        backgroundRepeat: 'repeat',
        WebkitOverflowScrolling: 'touch',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none'
      }}
    >
      {messages.map((message) => (
        <ChatBubble key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};