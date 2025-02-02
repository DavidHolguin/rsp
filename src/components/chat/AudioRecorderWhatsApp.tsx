import { useState, useRef, useEffect } from "react";
import { Mic, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface AudioRecorderProps {
  onAudioRecorded: (audioBlob: Blob, transcription?: string) => void;
  onCancel: () => void;
}

export const AudioRecorderWhatsApp = ({ onAudioRecorded, onCancel }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const startYRef = useRef<number>(0);
  const startXRef = useRef<number>(0);
  const timerRef = useRef<number>();

  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      setHasPermission(false);
      toast({
        title: "Error de permisos",
        description: "Necesitamos acceso al micrófono para grabar audio",
        variant: "destructive",
      });
    }
  };

  const startRecording = async () => {
    try {
      if (hasPermission === null) {
        await requestPermission();
        return;
      }

      if (!hasPermission) {
        toast({
          title: "Sin acceso al micrófono",
          description: "Por favor, habilita el acceso al micrófono en la configuración de tu navegador",
          variant: "destructive",
        });
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      setRecordingTime(0);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Error",
        description: "No se pudo acceder al micrófono",
        variant: "destructive",
      });
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return;

    return new Promise<void>((resolve) => {
      const mediaRecorder = mediaRecorderRef.current!;
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setIsRecording(false);
        clearInterval(timerRef.current);
        setRecordingTime(0);
        await processAndSendAudio(audioBlob);
        resolve();
      };
      mediaRecorder.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    });
  };

  const processAndSendAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      
      reader.onload = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        const { data, error } = await supabase.functions.invoke('transcribe-audio', {
          body: { audio: base64Audio }
        });

        if (error) throw error;
        
        onAudioRecorded(audioBlob, data.text);
      };
      
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error("Error processing audio:", error);
      toast({
        title: "Error",
        description: "No se pudo procesar el audio",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    startXRef.current = e.touches[0].clientX;
    startRecording();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isRecording) return;
    const currentX = e.touches[0].clientX;
    const diffX = startXRef.current - currentX;
    setIsDragging(diffX > 50);
  };

  const handleTouchEnd = async () => {
    if (!isRecording) return;
    if (isDragging) {
      mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      clearInterval(timerRef.current);
      setRecordingTime(0);
      onCancel();
    } else {
      await stopRecording();
    }
    setIsDragging(false);
  };

  const handleMouseDown = () => {
    startRecording();
  };

  const handleMouseUp = async () => {
    if (isRecording) {
      await stopRecording();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative">
      <button
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={cn(
          "transition-all duration-200 flex items-center justify-center",
          isRecording 
            ? "w-[200px] h-12 bg-white rounded-full" 
            : "w-12 h-12 rounded-full bg-[#00A884] hover:bg-[#00A884]/90",
          isDragging && "bg-red-600"
        )}
      >
        {isRecording ? (
          <div className="flex items-center gap-2 px-3 w-full">
            <ChevronLeft className={cn(
              "w-5 h-5 transition-opacity",
              isDragging ? "opacity-0" : "opacity-100"
            )} />
            <span className="text-sm text-gray-600 flex-1 text-left">
              {isDragging ? "Soltar para cancelar" : "Desliza para cancelar"}
            </span>
            <span className="text-sm text-gray-600 min-w-[40px] text-right">
              {formatTime(recordingTime)}
            </span>
          </div>
        ) : (
          <Mic className="w-6 h-6 text-white" />
        )}
      </button>
      
      {isRecording && (
        <div className="fixed inset-0 bg-black/20 animate-fade-in -z-10" />
      )}
    </div>
  );
};