import { useState, useEffect } from "react";
import { Message } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toZonedTime } from 'date-fns-tz';

const API_BASE_URL = "https://web-production-700a.up.railway.app";
const timeZone = 'America/Bogota';

export const useChat = (chatbotId: string, currentLead: { id: string; name: string } | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastMessageTime, setLastMessageTime] = useState<Date | null>(null);
  const { toast } = useToast();

  const showGreeting = (name: string, welcomeMessage?: string | null, quickQuestions?: string[] | null) => {
    const message = welcomeMessage || `¡Hola ${name}! ¿En qué puedo ayudarte hoy?`;

    setMessages([{
      id: "greeting",
      content: message,
      type: "text",
      timestamp: Date.now(),
      sender: "agent",
      metadata: quickQuestions?.length ? {
        quickReplies: quickQuestions
      } : undefined
    }]);
  };

  const handleSend = async (inputValue: string) => {
    if (!inputValue.trim() || !currentLead) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      type: "text",
      timestamp: Date.now(),
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      // Store user message in Supabase
      const { error: messageError } = await supabase
        .from("chat_messages")
        .insert({
          chatbot_id: chatbotId,
          lead_id: currentLead.id,
          message: inputValue,
          is_bot: false
        });

      if (messageError) {
        console.error("Error storing message:", messageError);
        toast({
          title: "Error",
          description: "No se pudo guardar el mensaje",
          variant: "destructive",
        });
        return;
      }

      // Get chatbot response from API
      const response = await fetch(
        `${API_BASE_URL}/api/v1/send-message?` +
        new URLSearchParams({
          agency_id: "157597a6-8ba8-4d8e-8bd9-a8b325c8b05b",
          chatbot_id: chatbotId,
          message: inputValue,
          lead_id: currentLead.id,
          channel: 'web'
        })
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();

      if (!data || !data.text) {
        throw new Error("Invalid response format from chatbot");
      }

      // Create text message
      const textMessage: Message = {
        id: `${Date.now()}-text`,
        content: data.text,
        type: "text",
        timestamp: new Date(data.timestamp).getTime(),
        sender: "agent",
      };

      setMessages(prev => [...prev, textMessage]);

      // If there are galleries, create separate image messages
      if (data.galleries && data.galleries.length > 0) {
        data.galleries.forEach((gallery: any) => {
          if (gallery.images && gallery.images.length > 0) {
            const imageMessage: Message = {
              id: `${Date.now()}-gallery-${gallery.id}`,
              content: "",
              type: "text",
              timestamp: new Date(data.timestamp).getTime() + 100,
              sender: "agent",
              metadata: {
                gallery: {
                  images: gallery.images.map((img: any) => ({
                    url: img.url,
                    description: img.description || img.name
                  }))
                }
              }
            };
            setMessages(prev => [...prev, imageMessage]);
          }
        });
      }

      // Store bot response in Supabase
      const { error: botMessageError } = await supabase
        .from("chat_messages")
        .insert({
          chatbot_id: chatbotId,
          lead_id: currentLead.id,
          message: data.text,
          is_bot: true,
          metadata: {
            galleries: data.galleries
          }
        });

      if (botMessageError) {
        console.error("Error storing bot message:", botMessageError);
        toast({
          title: "Error",
          description: "No se pudo guardar la respuesta del chatbot",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje. Por favor intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessageTime(new Date(messages[messages.length - 1].timestamp));
    }
  }, [messages]);

  return {
    messages,
    lastMessageTime,
    showGreeting,
    handleSend,
    setMessages
  };
};
