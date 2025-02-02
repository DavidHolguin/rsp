import { useState, useCallback } from "react";
import { Message } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";

export const useChat = (chatbotId: string, currentLead: { id: string; name: string } | null) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const showGreeting = useCallback((name: string) => {
    const greetingMessage: Message = {
      id: Date.now().toString(),
      content: `¡Hola, ${name}! ¿En qué puedo ayudarte hoy?`,
      type: "text",
      timestamp: Date.now(),
      sender: "agent"
    };
    setMessages(prev => [...prev, greetingMessage]);
  }, []);

  const handleSend = useCallback(async (content: string, silent: boolean = false) => {
    if (!content.trim() || !currentLead) return;

    if (!silent) {
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        type: "text",
        timestamp: Date.now(),
        sender: "user"
      };
      setMessages(prev => [...prev, userMessage]);
    }

    try {
      const { data: response } = await supabase.functions.invoke('chat', {
        body: { message: content, chatbotId, leadId: currentLead.id }
      });

      if (response?.message) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.message,
          type: "text",
          timestamp: Date.now(),
          sender: "agent",
          metadata: response.metadata
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, [chatbotId, currentLead]);

  return {
    messages,
    showGreeting,
    handleSend,
    setMessages
  };
};
