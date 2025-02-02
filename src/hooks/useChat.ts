import { useState, useCallback } from "react";
import { Message } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useChat = (chatbotId: string, currentLead: { id: string; name: string } | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

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
    if (!content.trim() || !currentLead || !chatbotId) {
      console.error("Missing required parameters:", { content, currentLead, chatbotId });
      return;
    }

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
      const { data: response, error } = await supabase.functions.invoke('chat', {
        body: { 
          message: content, 
          chatbotId, 
          leadId: currentLead.id 
        }
      });

      if (error) {
        console.error("Error calling chat function:", error);
        toast({
          title: "Error",
          description: "No se pudo enviar el mensaje. Por favor intenta nuevamente.",
          variant: "destructive",
        });
        return;
      }

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
      toast({
        title: "Error",
        description: "Hubo un problema al procesar tu mensaje. Por favor intenta nuevamente.",
        variant: "destructive",
      });
    }
  }, [chatbotId, currentLead, toast]);

  return {
    messages,
    showGreeting,
    handleSend,
    setMessages
  };
};