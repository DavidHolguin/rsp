import { useState, useRef, useEffect } from "react";
import { ChatSidebar } from "./ChatSidebar";
import { OnboardingModal } from "./OnboardingModal";
import { Message } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";
import { useChatbot } from "@/hooks/useChatbot";
import { useChat } from "@/hooks/useChat";
import { useLeadTracking } from "@/hooks/useLeadTracking";

const CHATBOT_ID = "f137fdf2-f026-4cf4-ae03-b16b8d9837a9"; // Actualizado
const AGENCY_ID = "157597a6-8ba8-4d8e-8bd9-a8b325c8b05b";

export const ChatInterface = () => {
  const [inputValue, setInputValue] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentLead, setCurrentLead] = useState<{ id: string; name: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { chatbot } = useChatbot(CHATBOT_ID);
  const { messages, showGreeting, handleSend, setMessages } = useChat(CHATBOT_ID, currentLead);
  const { trackInteraction } = useLeadTracking(currentLead?.id);

  const storedLead = localStorage.getItem('currentLead');
  const parsedLead = storedLead ? JSON.parse(storedLead) : null;

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (parsedLead) {
        const { data: existingLead } = await supabase
          .from("leads")
          .select("id, name, has_completed_onboarding")
          .eq("id", parsedLead.id)
          .single();

        if (existingLead) {
          setCurrentLead(parsedLead);
          showGreeting(parsedLead.name, chatbot?.welcome_message, chatbot?.quick_questions);
          return;
        } else {
          localStorage.removeItem('currentLead');
        }
      }

      setShowOnboarding(true);
    };

    checkOnboardingStatus();
  }, [chatbot]);

  const handleOnboarding = async (name: string, phone: string) => {
    try {
      const { data: leadId, error } = await supabase.rpc(
        "create_or_update_lead",
        {
          p_name: name,
          p_phone: phone,
          p_email: "",
          p_agency_id: AGENCY_ID,
          p_source: "chat"
        }
      );

      if (error) throw error;

      await supabase
        .from("leads")
        .update({ 
          has_completed_onboarding: true,
          last_greeting_at: new Date().toISOString()
        })
        .eq("id", leadId);

      const leadData = { id: leadId, name };
      setCurrentLead(leadData);
      localStorage.setItem('currentLead', JSON.stringify(leadData));
      setShowOnboarding(false);
      showGreeting(name, chatbot?.welcome_message, chatbot?.quick_questions);

      trackInteraction('onboarding_complete', { name });

      const { error: convError } = await supabase
        .from("chat_conversations")
        .insert({
          chatbot_id: CHATBOT_ID,
          lead_id: leadId,
          title: `Conversación con ${name}`
        });

      if (convError) {
        console.error("Error creating conversation:", convError);
      }

      toast({
        title: "¡Bienvenido!",
        description: "Gracias por compartir tus datos",
      });
    } catch (error) {
      console.error("Error during onboarding:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al guardar tus datos. Por favor intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputValue);
      setInputValue("");
      trackInteraction('message_sent', { type: 'text', length: inputValue.length });
    }
  };

  const handleQuickReplyClick = (text: string) => {
    handleSend(text);
    trackInteraction('message_sent', { type: 'quick_reply', text });
  };

  const handleAudioRecorded = async (audioBlob: Blob, transcription?: string) => {
    if (transcription && currentLead) {
      handleSend(transcription);
      trackInteraction('message_sent', { 
        type: 'audio',
        hasTranscription: true
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0B141A] dark:bg-[#0B141A]">
      <ChatHeader 
        chatbot={chatbot} 
        onOpenSidebar={() => setSidebarOpen(true)} 
      />

      <MessageList 
        messages={messages}
        messagesEndRef={messagesEndRef}
        onQuickReplyClick={handleQuickReplyClick}
      />

      <MessageInput
        value={inputValue}
        onChange={setInputValue}
        onSend={() => {
          handleSend(inputValue);
          setInputValue("");
          trackInteraction('message_sent', { type: 'text', length: inputValue.length });
        }}
        onKeyPress={handleKeyPress}
        onAudioRecorded={handleAudioRecorded}
        inputRef={inputRef}
      />

      <ChatSidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        currentLeadId={currentLead?.id}
      />
      
      {showOnboarding && (
        <OnboardingModal onSubmit={handleOnboarding} />
      )}
    </div>
  );
};