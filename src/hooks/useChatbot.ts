import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { supabase } from "@/integrations/supabase/client";
import { Chatbot } from "@/types/chat";
import { useToast } from "@/components/ui/use-toast";

export const useChatbot = (chatbotId: string) => {
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);
  const { theme } = useTheme();
  const { toast } = useToast();

  const fetchChatbotData = async () => {
    try {
      const { data, error } = await supabase
        .from("chatbots")
        .select("name, icon_url, description")
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