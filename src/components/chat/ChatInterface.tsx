import { useState, useRef, useEffect } from "react";
import { Send, Sun, Moon, Menu } from "lucide-react";
import { ChatBubble } from "./ChatBubble";
import { AudioRecorder } from "./AudioRecorder";
import { ChatSidebar } from "./ChatSidebar";
import { Message } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

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
      <div className="flex items-center justify-between p-4 bg-primary dark:bg-gray-800 text-white">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-white/90"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Asistente Virtual</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-white/90"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:text-white/90"
            onClick={() => {
              setMessages([]);
              setIsInitialized(false);
            }}
          >
            Nueva Conversación
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