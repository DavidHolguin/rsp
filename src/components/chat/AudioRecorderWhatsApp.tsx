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
  const touchStartTimeRef = useRef<number>(0);

  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error("Error requesting permission:", error);
      setHasPermission(false);
      toast({
        title: "Error de permisos",
        description: "Necesitamos acceso al micrófono para grabar audio",
        variant: "destructive",
      });
      return false;
    }
  };

  const startRecording = async () => {
    try {
      console.log("Starting recording...");
      if (!hasPermission) {
        const permissionGranted = await requestPermission();
        if (!permissionGranted) return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Got media stream:", stream);
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      console.log("Recording started");
      
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Error",
        description: "No se pudo acceder al micrófono",
        variant: "destructive",
      });
    }
  };

  const stopRecording = async (shouldSave: boolean = true) => {
    if (!mediaRecorderRef.current) return;
    console.log("Stopping recording...");

    return new Promise<void>((resolve) => {
      const mediaRecorder = mediaRecorderRef.current!;
      mediaRecorder.onstop = async () => {
        if (shouldSave) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          await processAndSendAudio(audioBlob);
        }
        setIsRecording(false);
        clearInterval(timerRef.current);
        setRecordingTime(0);
        resolve();
      };
      mediaRecorder.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    });
  };

  const processAndSendAudio = async (audioBlob: Blob) => {
    if (recordingTime < 1) {
      toast({
        title: "Grabación muy corta",
        description: "Mantén presionado más tiempo para grabar un mensaje",
        variant: "destructive",
      });
      return;
    }

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

  const handleTouchStart = async (e: React.TouchEvent) => {
    e.preventDefault();
    console.log("Touch start event triggered");
    startYRef.current = e.touches[0].clientY;
    startXRef.current = e.touches[0].clientX;
    touchStartTimeRef.current = Date.now();
    
    if (hasPermission === null) {
      const permissionGranted = await requestPermission();
      if (permissionGranted) {
        await startRecording();
      }
    } else if (hasPermission) {
      await startRecording();
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isRecording) return;
    
    const currentX = e.touches[0].clientX;
    const diffX = startXRef.current - currentX;
    setIsDragging(diffX > 50);
  };

  const handleTouchEnd = async () => {
    if (!isRecording) return;
    console.log("Touch end event triggered");
    
    if (isDragging) {
      await stopRecording(false);
      onCancel();
    } else {
      await stopRecording(true);
    }
    setIsDragging(false);
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