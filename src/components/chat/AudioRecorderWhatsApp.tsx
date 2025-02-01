import { useState, useRef, useEffect } from "react";
import { Mic, X, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface AudioRecorderProps {
  onAudioRecorded: (audioBlob: Blob, transcription?: string) => void;
  onCancel: () => void;
}

export const AudioRecorderWhatsApp = ({ onAudioRecorded, onCancel }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const startYRef = useRef<number>(0);
  const timerRef = useRef<number>();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
      
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
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
        setRecordingTime(0);
      };
      
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error("Error processing audio:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    startRecording();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isRecording) return;
    const currentY = e.touches[0].clientY;
    const diff = startYRef.current - currentY;
    setIsDragging(diff > 50);
  };

  const handleTouchEnd = async () => {
    if (!isRecording) return;
    if (isDragging) {
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
          "w-12 h-12 rounded-full transition-all duration-200 flex items-center justify-center",
          isRecording ? "bg-red-500" : "bg-[#00A884] hover:bg-[#00A884]/90",
          isDragging && "bg-red-600"
        )}
      >
        {isDragging ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Mic className="w-6 h-6 text-white" />
        )}
      </button>
      
      {isRecording && (
        <>
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-[#1F2C34] text-white text-sm px-4 py-3 rounded-lg flex items-center gap-3 shadow-lg animate-fade-in min-w-[200px]">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
            {formatTime(recordingTime)}
            <ChevronUp className="w-4 h-4 ml-auto" />
          </div>
          <div className="fixed inset-0 bg-black/20 animate-fade-in -z-10" />
        </>
      )}
    </div>
  );
};