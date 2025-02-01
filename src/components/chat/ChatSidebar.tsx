import { useEffect, useState } from "react";
import { X, MessageSquarePlus, FileText, Shield, MoreVertical } from "lucide-react";
import { useTheme } from "next-themes";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      // Get current lead from localStorage
      const storedLead = localStorage.getItem('currentLead');
      if (!storedLead) return;

      const currentLead = JSON.parse(storedLead);

      const { data } = await supabase
        .from("chat_conversations")
        .select("id, title, created_at")
        .eq("chatbot_id", "2941bb4a-cdf4-4677-8e0b-d1def860728d")
        .eq("lead_id", currentLead.id)
        .order("created_at", { ascending: false });

      if (data) {
        setConversations(data);
      }
    };

    fetchAgencyData();
    fetchConversations();
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
        <div className="flex flex-col h-full bg-background">
          <div className="p-4 border-b flex items-center justify-between bg-white dark:bg-gray-900 h-[72px]">
            <Button
              variant="default"
              className="w-full justify-start gap-2 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => {
                onClose();
              }}
            >
              <MessageSquarePlus className="h-5 w-5" />
              <span>Nueva Conversación</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="ml-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1 px-4">
            <div className="space-y-2 py-4">
              {conversations.map((conversation) => (
                <Button
                  key={conversation.id}
                  variant="ghost"
                  className="w-full justify-start text-left"
                >
                  <span className="truncate">
                    {conversation.title || "Conversación sin título"}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {new Date(conversation.created_at).toLocaleDateString()}
                  </span>
                </Button>
              ))}
            </div>
          </ScrollArea>

          {agency && (
            <div className="p-4 mt-auto border-t bg-muted/50">
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
                      {getInitials(agency.name)}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{agency.name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {agency.contact_email}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <FileText className="mr-2 h-4 w-4" />
                      Términos y Condiciones
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Shield className="mr-2 h-4 w-4" />
                      Políticas de Uso
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};