import { useState, useRef, useEffect } from "react";
import { MoreVertical, Send, Smile } from "lucide-react";
import { ChatBubble } from "./ChatBubble";
import { AudioRecorderWhatsApp } from "./AudioRecorderWhatsApp";
import { ChatSidebar } from "./ChatSidebar";
import { OnboardingModal } from "./OnboardingModal";
import { Message, Chatbot } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toZonedTime } from 'date-fns-tz';
import EmojiPicker from 'emoji-picker-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";

const AGENCY_ID = "157597a6-8ba8-4d8e-8bd9-a8b325c8b05b";
const CHATBOT_ID = "2941bb4a-cdf4-4677-8e0b-d1def860728d";
const API_BASE_URL = "https://web-production-700a.up.railway.app";
const timeZone = 'America/Bogota';

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentLead, setCurrentLead] = useState<{ id: string; name: string } | null>(null);
  const [sessionStartTime] = useState<Date>(new Date());
  const [lastMessageTime, setLastMessageTime] = useState<Date | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const { toast } = useToast();

  // Initialize lead tracking session
  useEffect(() => {
    const initializeLeadTracking = async (leadId: string) => {
      const { error } = await supabase
        .from('lead_tracking')
        .insert({
          lead_id: leadId,
          session_start: new Date().toISOString(),
          page_views: [{ path: window.location.pathname, timestamp: new Date().toISOString() }],
          interactions: []
        });

      if (error) {
        console.error('Error initializing lead tracking:', error);
      }
    };

    if (currentLead?.id) {
      initializeLeadTracking(currentLead.id);
    }

    // Cleanup function to update session end time
    return () => {
      if (currentLead?.id) {
        updateLeadSession(currentLead.id);
      }
    };
  }, [currentLead?.id]);

  const updateLeadSession = async (leadId: string) => {
    const { error } = await supabase
      .from('lead_tracking')
      .update({
        session_end: new Date().toISOString(),
      })
      .eq('lead_id', leadId)
      .is('session_end', null);

    if (error) {
      console.error('Error updating lead session:', error);
    }
  };

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const { data: existingLead } = await supabase
        .from("leads")
        .select("id, name, has_completed_onboarding")
        .eq("active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!existingLead || !existingLead.has_completed_onboarding) {
        setShowOnboarding(true);
      } else {
        setCurrentLead({ id: existingLead.id, name: existingLead.name });
        showGreeting(existingLead.name);
      }
    };

    checkOnboardingStatus();
  }, []);

  const showGreeting = (name: string) => {
    const now = new Date();
    const zonedDate = toZonedTime(now, timeZone);
    const hour = zonedDate.getHours();
    let greeting = "Buenos días";
    if (hour >= 12 && hour < 18) greeting = "Buenas tardes";
    if (hour >= 18) greeting = "Buenas noches";

    setMessages([{
      id: "greeting",
      content: `${greeting}, ${name}. ¿En qué puedo ayudarte hoy?`,
      type: "text",
      timestamp: Date.now(),
      sender: "agent",
    }]);
  };

  const handleOnboarding = async (name: string, phone: string) => {
    try {
      const { data: agency, error: agencyError } = await supabase
        .from("agencies")
        .select("id")
        .eq("id", AGENCY_ID)
        .single();

      if (agencyError || !agency) {
        throw new Error("Agency not found. Please contact support.");
      }

      // Create or update lead using the RPC function
      const { data: leadId, error } = await supabase.rpc(
        "create_or_update_lead",
        {
          p_name: name,
          p_phone: phone,
          p_email: "",
          p_agency_id: agency.id,
          p_source: "chat"
        }
      );

      if (error) throw error;

      // Update lead status
      await supabase
        .from("leads")
        .update({ 
          has_completed_onboarding: true,
          last_greeting_at: new Date().toISOString()
        })
        .eq("id", leadId);

      setCurrentLead({ id: leadId, name });
      setShowOnboarding(false);
      showGreeting(name);

      // Create initial conversation
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

  const fetchChatbotData = async () => {
    const { data } = await supabase
      .from("chatbots")
      .select("name, icon_url, description")
      .eq("id", CHATBOT_ID)
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

  const handleSend = async () => {
    if (!inputValue.trim() || !currentLead) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      type: "text",
      timestamp: Date.now(),
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    try {
      // Store user message in Supabase
      const { error: messageError } = await supabase
        .from("chat_messages")
        .insert({
          chatbot_id: CHATBOT_ID,
          lead_id: currentLead.id,
          message: inputValue,
          is_bot: false
        });

      if (messageError) {
        console.error("Error storing message:", messageError);
        throw messageError;
      }

      // Get chatbot response from API
      const response = await fetch(
        `${API_BASE_URL}/api/v1/send-message?` +
        new URLSearchParams({
          agency_id: AGENCY_ID,
          chatbot_id: CHATBOT_ID,
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
          chatbot_id: CHATBOT_ID,
          lead_id: currentLead.id,
          message: data.text,
          is_bot: true,
          metadata: {
            galleries: data.galleries
          }
        });

      if (botMessageError) {
        console.error("Error storing bot message:", botMessageError);
        throw botMessageError;
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

    if (transcription && currentLead) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/send-message?` +
          new URLSearchParams({
            agency_id: AGENCY_ID,
            chatbot_id: CHATBOT_ID,
            message: transcription,
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

      } catch (error) {
        console.error("Error sending transcribed message:", error);
        toast({
          title: "Error",
          description: "No se pudo procesar el mensaje de voz. Por favor intenta nuevamente.",
          variant: "destructive",
        });
      }
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
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center p-3 bg-[#1F2C34] dark:bg-[#1F2C34] border-b dark:border-gray-700">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            {chatbot?.icon_url && (
              <>
                <img 
                  src={chatbot.icon_url} 
                  alt={chatbot.name || "Chatbot"} 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#00A884] rounded-full border-2 border-[#1F2C34]" />
              </>
            )}
          </div>
          <div className="text-white">
            <h1 className="text-base font-medium leading-tight">
              {chatbot?.name || "Asistente Virtual"}
            </h1>
            <p className="text-xs text-gray-400">
              {chatbot?.description || "En línea"}
            </p>
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

      {/* Messages */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4 mt-[56px] mb-[72px] bg-[#0B141A] dark:bg-[#0B141A]"
        style={{
          backgroundImage: 'url(https://static.whatsapp.net/rsrc.php/v4/yl/r/gi_DckOUM5a.png)',
          backgroundSize: 'contain',
          backgroundRepeat: 'repeat'
        }}
      >
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message}
            isAgent={message.sender === "agent"}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
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
      
      {showOnboarding && (
        <OnboardingModal onSubmit={handleOnboarding} />
      )}
    </div>
  );
};