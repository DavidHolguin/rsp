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

interface OnboardingModalProps {
  onSubmit: (name: string, phone: string) => void;
}

export const OnboardingModal = ({ onSubmit }: OnboardingModalProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Por favor completa todos los campos");
      return;
    }
    onSubmit(name, phone);
  };

  return (
    <AlertDialog open={true}>
      <AlertDialogContent className="bg-[#1F2C34] border-none max-w-[90%] w-[400px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-white text-center mb-2">
            ¡Bienvenido!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300 text-center mb-6">
            Para ofrecerte una experiencia personalizada, necesitamos algunos datos
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 bg-[#2A3942] border-none text-white placeholder:text-gray-400"
            />
            <Input
              type="tel"
              placeholder="Número de teléfono"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-12 bg-[#2A3942] border-none text-white placeholder:text-gray-400"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-[#00A884] hover:bg-[#00A884]/90 text-white py-6"
          >
            Continuar
          </Button>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};