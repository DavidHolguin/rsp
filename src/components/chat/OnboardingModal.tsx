import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface OnboardingModalProps {
  onSubmit: (name: string, phone: string) => void;
}

export const OnboardingModal = ({ onSubmit }: OnboardingModalProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+57");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Por favor completa todos los campos");
      return;
    }

    try {
      const fullPhone = `${countryCode}${phone}`;
      
      // Create or update lead
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .upsert({
          phone: fullPhone,
          name: name,
          agency_id: "157597a6-8ba8-4d8e-8bd9-a8b325c8b05b",
          has_completed_onboarding: true,
          source: 'web'
        }, {
          onConflict: 'phone',
          ignoreDuplicates: false
        });

      if (leadError) {
        console.error('Error creating lead:', leadError);
        setError("Error al guardar la información");
        return;
      }

      onSubmit(name, fullPhone);
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError("Error al procesar la información");
    }
  };

  const countryCodes = [
    { value: "+57", label: "Colombia 🇨🇴" },
    { value: "+1", label: "Estados Unidos 🇺🇸" },
    { value: "+52", label: "México 🇲🇽" },
    { value: "+34", label: "España 🇪🇸" },
    { value: "+54", label: "Argentina 🇦🇷" },
    { value: "+56", label: "Chile 🇨🇱" },
    { value: "+51", label: "Perú 🇵🇪" },
    { value: "+58", label: "Venezuela 🇻🇪" },
  ];

  return (
    <AlertDialog open={true}>
      <AlertDialogContent className="bg-[#1F2C34] border-none max-w-[90%] w-[400px] p-8">
        <AlertDialogHeader className="space-y-6">
          <div className="mx-auto bg-[#00A884] w-16 h-16 rounded-full flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <AlertDialogTitle className="text-2xl font-bold text-white text-center">
            ¡Bienvenido al Chat!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300 text-center text-base">
            Conéctate con nosotros y descubre una nueva forma de comunicarte. Solo necesitamos algunos datos para comenzar.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 bg-[#2A3942] border-none text-white placeholder:text-gray-400 text-base"
              />
            </div>
            <div className="flex gap-2">
              <Select defaultValue={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="w-[140px] h-12 bg-[#2A3942] border-none text-white">
                  <SelectValue placeholder="País" />
                </SelectTrigger>
                <SelectContent className="bg-[#2A3942] border-none text-white">
                  {countryCodes.map((code) => (
                    <SelectItem key={code.value} value={code.value} className="hover:bg-[#374248]">
                      {code.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="tel"
                placeholder="WhatsApp"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-12 bg-[#2A3942] border-none text-white placeholder:text-gray-400 text-base"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-[#00A884] hover:bg-[#00A884]/90 text-white py-6 text-base font-medium"
          >
            Comenzar chat
          </Button>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};