import { useEffect, useState } from "react";
import { Settings, FileText, Shield, X } from "lucide-react";
import { useTheme } from "next-themes";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface Agency {
  name: string;
  logo_url: string;
  contact_email: string;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

interface ChatSidebarProps {
  open: boolean;
  onClose: () => void;
}

export const ChatSidebar = ({ open, onClose }: ChatSidebarProps) => {
  const [agency, setAgency] = useState<Agency | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchAgencyData = async () => {
      const { data } = await supabase
        .from("agencies")
        .select("name, logo_url, contact_email")
        .eq("id", "157597a6-8ba8-4d8e-8bd9-a8b325c8b05b")
        .single();

      if (data) {
        setAgency(data);
      }
    };

    const fetchConversations = async () => {
      const { data } = await supabase
        .from("chat_conversations")
        .select("id, title, created_at")
        .eq("chatbot_id", "2941bb4a-cdf4-4677-8e0b-d1def860728d")
        .order("created_at", { ascending: false });

      if (data) {
        setConversations(data);
      }
    };

    fetchAgencyData();
    fetchConversations();
  }, []);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
        <SheetHeader className="p-4 bg-primary dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-white">Menu</SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-white/90"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-64px)]">
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <div className="space-y-1 p-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                >
                  <Settings className="h-5 w-5" />
                  Ajustes
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                >
                  <FileText className="h-5 w-5" />
                  Términos y Condiciones
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                >
                  <Shield className="h-5 w-5" />
                  Políticas de Uso
                </Button>
              </div>

              <Separator className="my-4" />

              <div className="px-4">
                <h4 className="text-sm font-medium mb-2">Conversaciones Previas</h4>
                <div className="space-y-2">
                  {conversations.map((conversation) => (
                    <Button
                      key={conversation.id}
                      variant="ghost"
                      className="w-full justify-start text-left"
                    >
                      {conversation.title || "Conversación sin título"}
                      <span className="text-xs text-muted-foreground ml-auto">
                        {new Date(conversation.created_at).toLocaleDateString()}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {agency && (
              <div className="p-4 mt-auto border-t">
                <div className="flex items-center gap-3">
                  {agency.logo_url ? (
                    <img
                      src={agency.logo_url}
                      alt={agency.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary">
                        {agency.name[0]}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{agency.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {agency.contact_email}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};