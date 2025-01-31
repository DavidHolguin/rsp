import { useState, useRef, useEffect } from "react";
import { MoreVertical, Send, Smile, Clock } from "lucide-react";
import { ChatBubble } from "./ChatBubble";
import { AudioRecorderWhatsApp } from "./AudioRecorderWhatsApp";
import { ChatSidebar } from "./ChatSidebar";
import { Message, Chatbot } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import EmojiPicker from 'emoji-picker-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);
  const [lastMessageTime, setLastMessageTime] = useState<Date | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchChatbotData = async () => {
      const { data } = await supabase
        .from("chatbots")
        .select("name, icon_url, description")
        .eq("id", "2941bb4a-cdf4-4677-8e0b-d1def860728d")
        .single();

      if (data) {
        setChatbot(data);
        document.title = data.name || "Chat Asistente Virtual";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', data.description || "Asistente virtual para consultas y reservas");
        }
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
          metaTheme.setAttribute('content', theme === 'dark' ? '#1F2937' : '#ffffff');
        }
      }
    };

    fetchChatbotData();
  }, [theme]);

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

    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Gracias por tu mensaje. ¿En qué más puedo ayudarte?",
        type: "text",
        timestamp: Date.now(),
        sender: "agent",
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

  const handleAudioRecorded = async (audioBlob: Blob, transcription?: string) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: audioUrl,
      type: "audio",
      timestamp: Date.now(),
      sender: "user",
      metadata: transcription ? { transcription } : undefined
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsRecording(false);

    if (transcription) {
      setTimeout(() => {
        const agentResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: `He recibido tu mensaje de voz que dice: "${transcription}". ¿En qué puedo ayudarte?`,
          type: "text",
          timestamp: Date.now(),
          sender: "agent",
        };
        setMessages((prev) => [...prev, agentResponse]);
      }, 1000);
    }
  };

  const onEmojiClick = (emojiData: any) => {
    const emoji = emojiData.emoji;
    const cursorPosition = inputRef.current?.selectionStart || 0;
    const updatedValue = 
      inputValue.slice(0, cursorPosition) + 
      emoji + 
      inputValue.slice(cursorPosition);
    setInputValue(updatedValue);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-screen bg-[#0B141A] dark:bg-[#0B141A]">
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center p-4 bg-[#1F2C34] dark:bg-[#1F2C34] border-b dark:border-gray-700">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative">
            {chatbot?.icon_url && (
              <>
                <img 
                  src={chatbot.icon_url} 
                  alt={chatbot.name || "Chatbot"} 
                  className="w-10 h-10 rounded-full"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00A884] rounded-full border-2 border-[#1F2C34]" />
              </>
            )}
          </div>
          <div className="text-white">
            <h1 className="text-lg font-semibold truncate max-w-[200px]">
              {chatbot?.name || "Asistente Virtual"}
            </h1>
            {lastMessageTime && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                <span>
                  {formatDistanceToNow(lastMessageTime, { 
                    addSuffix: true,
                    locale: es,
                  }).replace('hace', 'Hace')}
                </span>
              </div>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          className="text-gray-300"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0B141A] dark:bg-[#0B141A] mt-[72px] mb-[72px]">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message}
            isAgent={message.sender === "agent"}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 border-t dark:border-gray-700 bg-[#1F2C34] dark:bg-[#1F2C34]">
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-gray-300 hover:text-gray-100"
              >
                <Smile className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-full p-0" 
              side="top" 
              align="start"
            >
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                width="100%"
                height="350px"
              />
            </PopoverContent>
          </Popover>
          
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un mensaje..."
            className="flex-1 dark:bg-[#2A3942] dark:text-white dark:border-gray-700 rounded-full"
          />
          
          {inputValue.trim() ? (
            <Button 
              onClick={handleSend} 
              className="bg-[#00A884] hover:bg-[#00A884]/90 rounded-full"
              size="icon"
            >
              <Send className="w-5 h-5" />
            </Button>
          ) : (
            <AudioRecorderWhatsApp 
              onAudioRecorded={handleAudioRecorded}
              onCancel={() => setIsRecording(false)}
            />
          )}
        </div>
      </div>

      <ChatSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};
