import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { supabase } from "@/integrations/supabase/client";
import { Chatbot } from "@/types/chat";
import { useToast } from "@/components/ui/use-toast";
import { toZonedTime } from 'date-fns-tz';

export const useChatbot = (chatbotId: string) => {
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);
  const { theme } = useTheme();
  const { toast } = useToast();

  const fetchChatbotData = async () => {
    try {
      const { data, error } = await supabase
        .from("chatbots")
        .select("id, name, icon_url, description, welcome_message, quick_questions")
        .eq("id", chatbotId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching chatbot data:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar la información del chatbot",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        const chatbotData: Chatbot = {
          id: data.id,
          name: data.name,
          icon_url: data.icon_url,
          description: data.description,
          welcome_message: data.welcome_message,
          quick_questions: Array.isArray(data.quick_questions) 
            ? data.quick_questions.map(q => String(q))
            : []
        };
        
        setChatbot(chatbotData);
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
    } catch (error) {
      console.error("Error in fetchChatbotData:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al conectar con el servidor",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchChatbotData();
  }, [chatbotId]);

  return { chatbot };
};