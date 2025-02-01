import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chatbot } from "@/types/chat";

interface ChatHeaderProps {
  chatbot: Chatbot | null;
  onOpenSidebar: () => void;
}

export const ChatHeader = ({ chatbot, onOpenSidebar }: ChatHeaderProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center p-3 bg-[#1F2C34] dark:bg-[#1F2C34] border-b dark:border-gray-700">
      <div className="flex items-center gap-3 flex-1">
        <div className="relative">
          {chatbot?.icon_url ? (
            <>
              <img 
                src={chatbot.icon_url} 
                alt={chatbot.name || "Chatbot"} 
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#00A884] rounded-full border-2 border-[#1F2C34]" />
            </>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
              <span className="text-white text-sm">
                {chatbot?.name?.charAt(0) || 'A'}
              </span>
            </div>
          )}
        </div>
        <div className="text-white">
          <h1 className="text-base font-medium leading-tight">
            {chatbot?.name || "Asistente Virtual"}
          </h1>
          <p className="text-xs text-gray-400">
            {chatbot?.description || "En línea"}
          </p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onOpenSidebar}
        className="text-gray-300"
      >
        <MoreVertical className="h-5 w-5" />
      </Button>
    </div>
  );
};