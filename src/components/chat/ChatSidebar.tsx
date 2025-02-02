import { useEffect, useState } from "react";
import { X, FileText, Shield, MoreVertical, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

interface ChatSidebarProps {
  open: boolean;
  onClose: () => void;
  currentLeadId?: string;
}

export const ChatSidebar = ({ open, onClose, currentLeadId }: ChatSidebarProps) => {
  const [agency, setAgency] = useState<Agency | null>(null);
  const [currentLead, setCurrentLead] = useState<{name: string; phone: string} | null>(null);
  const navigate = useNavigate();

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

    const fetchLeadData = async () => {
      if (!currentLeadId) return;

      const { data } = await supabase
        .from("leads")
        .select("name, phone")
        .eq("id", currentLeadId)
        .single();

      if (data) {
        setCurrentLead(data);
      }
    };

    fetchAgencyData();
    if (open) {
      fetchLeadData();
    }
  }, [open, currentLeadId]);

  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
  };

  const menuItems = [
    {
      title: "Términos y Condiciones",
      icon: FileText,
      path: "/terms-and-conditions"
    },
    {
      title: "Políticas de Uso",
      icon: Shield,
      path: "/usage-policies"
    },
    {
      title: "Políticas de Cancelación",
      icon: FileText,
      path: "/cancellation-policies"
    }
  ];

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
        <div className="flex flex-col h-full bg-[#1F2C34] dark:bg-[#1F2C34]">
          <div className="p-4 border-b border-[#2A3942] bg-[#1F2C34] dark:bg-[#1F2C34]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-[#00A884] text-white">
                    {currentLead ? getInitials(currentLead.name) : <User className="h-6 w-6" />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium text-white">{currentLead?.name || "Usuario"}</span>
                  <span className="text-sm text-gray-400">{currentLead?.phone || "Sin teléfono"}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="ml-2 text-gray-400 hover:text-gray-300 hover:bg-[#2A3942]"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {menuItems.map((item) => (
                <Button
                  key={item.title}
                  variant="ghost"
                  className="w-full justify-start gap-2 text-gray-300 hover:text-white hover:bg-[#2A3942]"
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>

          {agency && (
            <div className="p-4 mt-auto border-t border-[#2A3942] bg-[#1F2C34] dark:bg-[#1F2C34]">
              <div className="flex items-center gap-3">
                {agency.logo_url ? (
                  <img
                    src={agency.logo_url}
                    alt={agency.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#2A3942] flex items-center justify-center">
                    <span className="text-lg font-semibold text-white">
                      {getInitials(agency.name)}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{agency.name}</p>
                  <p className="text-sm text-gray-400 truncate">
                    {agency.contact_email}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-300 hover:bg-[#2A3942]">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#2A3942] border-[#2A3942]">
                    <DropdownMenuItem onClick={() => navigate("/terms-and-conditions")} className="text-gray-300 hover:text-white focus:text-white focus:bg-[#374248]">
                      <FileText className="mr-2 h-4 w-4" />
                      Términos y Condiciones
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/usage-policies")} className="text-gray-300 hover:text-white focus:text-white focus:bg-[#374248]">
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