import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface EmbedConfig {
  title: string;
  messages: string[];
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  buttonColor: string;
  avatarUrl: string;
  chatbotId: string;
}

const defaultConfig: EmbedConfig = {
  title: '¡Hola, Estoy Disponible! 👋',
  messages: [
    "¿Quieres hacer una reserva? 🎫",
    "¡Descubre nuestra magia! ✨",
    "Te ayudo a planear tu visita 🗓️",
    "¿Tienes preguntas? ¡Adelante! 💭",
    "Conoce nuestras atracciones 🎢",
    "¡Hagamos tu día especial! 🌟",
    "¿Listo para la aventura? 🌈",
    "Consulta disponibilidad aquí 📅"
  ],
  position: 'bottom-right',
  buttonColor: 'rgba(255, 255, 255, 0.1)',
  avatarUrl: 'https://images.squarespace-cdn.com/content/v1/6636d609741797274dd4724f/7226fe14-5e63-49eb-90cc-c2c03e209c1b/fsds.png',
  chatbotId: 'f137fdf2-f026-4cf4-ae03-b16b8d9837a9' // Actualizado
};

const EmbedGenerator = () => {
  const [config, setConfig] = useState<EmbedConfig>(() => {
    const saved = localStorage.getItem('embedConfig');
    return saved ? JSON.parse(saved) : defaultConfig;
  });
  const [messages, setMessages] = useState(config.messages.join('\n'));
  const [embedCode, setEmbedCode] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('embedConfig', JSON.stringify(config));
    generateEmbedCode();
  }, [config]);

  const handleMessagesChange = (value: string) => {
    const messageArray = value.split('\n').filter(msg => msg.trim());
    setMessages(value);
    setConfig(prev => ({ ...prev, messages: messageArray }));
  };

  const handlePositionChange = (value: string) => {
    setConfig(prev => ({
      ...prev,
      position: value as EmbedConfig['position']
    }));
  };

  const generateEmbedCode = () => {
    const code = `<script>
      window.chatbotConfig = {
        title: "${config.title}",
        messages: ${JSON.stringify(config.messages)},
        position: "${config.position}",
        buttonColor: "${config.buttonColor}",
        avatarUrl: "${config.avatarUrl}",
        chatbotId: "${config.chatbotId}"
      };
    </script>
    <script src="http://localhost:5173/embed/chatbot.js"></script>`;
    setEmbedCode(code);
  };

  const getPositionStyles = (position: string) => {
    switch (position) {
      case 'bottom-right':
        return 'bottom: 20px; right: 20px;';
      case 'bottom-left':
        return 'bottom: 20px; left: 20px;';
      case 'top-right':
        return 'top: 20px; right: 20px;';
      case 'top-left':
        return 'top: 20px; left: 20px;';
      default:
        return 'bottom: 20px; right: 20px;';
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    toast({
      title: "¡Código copiado!",
      description: "El código del widget ha sido copiado al portapapeles.",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Generador de Widget Embebido</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="pt-6">
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título del Botón</Label>
                <Input
                  id="title"
                  value={config.title}
                  onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="messages">Mensajes Animados (uno por línea)</Label>
                <Textarea
                  id="messages"
                  value={messages}
                  onChange={(e) => handleMessagesChange(e.target.value)}
                  rows={8}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Posición del Widget</Label>
                <Select
                  onValueChange={handlePositionChange}
                  defaultValue={config.position}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una posición" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottom-right">Abajo Derecha</SelectItem>
                    <SelectItem value="bottom-left">Abajo Izquierda</SelectItem>
                    <SelectItem value="top-right">Arriba Derecha</SelectItem>
                    <SelectItem value="top-left">Arriba Izquierda</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="buttonColor">Color del Botón</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Input
                      id="buttonColor"
                      value={config.buttonColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, buttonColor: e.target.value }))}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Usa valores rgba() o hexadecimal</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatarUrl">URL del Avatar</Label>
                <Input
                  id="avatarUrl"
                  value={config.avatarUrl}
                  onChange={(e) => setConfig(prev => ({ ...prev, avatarUrl: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="chatbotId">ID del Chatbot</Label>
                <Input
                  id="chatbotId"
                  value={config.chatbotId}
                  onChange={(e) => setConfig(prev => ({ ...prev, chatbotId: e.target.value }))}
                />
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Código Generado</h2>
              <Textarea
                value={embedCode}
                readOnly
                className="h-[500px] font-mono text-sm"
              />
              <Button
                className="mt-4 w-full"
                onClick={copyToClipboard}
              >
                Copiar Código
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmbedGenerator;
