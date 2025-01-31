import { useState, useRef, useEffect } from "react";
import { Send, Sun, Moon, Menu } from "lucide-react";
import { ChatBubble } from "./ChatBubble";
import { AudioRecorder } from "./AudioRecorder";
import { ChatSidebar } from "./ChatSidebar";
import { Message } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { supabase } from "@/integrations/supabase/client";

interface Chatbot {
  name: string;
  icon_url: string;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);
  const [lastMessageTime, setLastMessageTime] = useState<Date | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    const fetchChatbotData = async () => {
      const { data } = await supabase
        .from("chatbots")
        .select("name, icon_url")
        .eq("id", "2941bb4a-cdf4-4677-8e0b-d1def860728d")
        .single();

      if (data) {
        setChatbot(data);
      }
    };

    fetchChatbotData();
  }, []);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isInitialized) {
      setMessages([
        {
          id: "welcome",
          content: "¡Hola! Por favor, comparte tu nombre y número de teléfono para comenzar.",
          type: "text",
          timestamp: Date.now(),
          sender: "agent",
        },
      ]);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessageTime(new Date(messages[messages.length - 1].timestamp));
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      type: "text",
      timestamp: Date.now(),
      sender: "user",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    // Simulate agent response with gallery
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Aquí tienes algunas imágenes de nuestra Suite Presidencial:",
        type: "gallery",
        timestamp: Date.now(),
        sender: "agent",
        metadata: {
          gallery: {
            images: [
              {
                url: "https://example.com/suite1.jpg",
                description: "Vista al mar",
              },
              {
                url: "https://example.com/suite2.jpg",
                description: "Baño de lujo",
              },
            ],
          },
          quickReplies: [
            {
              text: "Ver disponibilidad",
              action: "check_availability",
            },
            {
              text: "Hacer reserva",
              action: "book_now",
            },
          ],
        },
      };
      setMessages((prev) => [...prev, agentResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAudioRecorded = (blob: Blob) => {
    console.log("Audio recorded:", blob);
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: "🎤 Nota de voz",
      type: "audio",
      timestamp: Date.now(),
      sender: "user",
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center p-4 bg-primary dark:bg-gray-800 text-white">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-white/90"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              {chatbot?.icon_url ? (
                <img
                  src={chatbot.icon_url}
                  alt={chatbot.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-lg font-semibold text-white">
                    {chatbot?.name ? getInitials(chatbot.name) : "CB"}
                  </span>
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-primary dark:border-gray-800"></div>
            </div>
            <div className="flex flex-col items-start">
              <h1 className="text-lg font-semibold">{chatbot?.name || "Asistente Virtual"}</h1>
              {lastMessageTime && (
                <span className="text-xs text-white/70">
                  Último mensaje: {lastMessageTime.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-white/90"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 dark:bg-gray-800">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message}
            isAgent={message.sender === "agent"}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un mensaje..."
            className="flex-1 dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
          <AudioRecorder onAudioRecorded={handleAudioRecorded} />
          <Button onClick={handleSend} className="bg-primary hover:bg-primary/90">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <ChatSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};
