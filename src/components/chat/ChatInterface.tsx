import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { ChatBubble } from "./ChatBubble";
import { AudioRecorder } from "./AudioRecorder";
import { Message } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isInitialized) {
      // Add initial welcome message
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

    // Simulate agent response
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Gracias por tu mensaje. ¿En qué puedo ayudarte?",
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

  const handleAudioRecorded = (blob: Blob) => {
    // Here you would normally process the audio
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
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex items-center justify-between p-4 bg-primary text-white">
        <h1 className="text-lg font-semibold">Asistente Virtual</h1>
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

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message}
            isAgent={message.sender === "agent"}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-white">
        <div className="flex items-center space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un mensaje..."
            className="flex-1"
          />
          <AudioRecorder onAudioRecorded={handleAudioRecorded} />
          <Button onClick={handleSend} className="bg-primary hover:bg-primary/90">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};