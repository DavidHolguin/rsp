import { useState } from "react";
import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioRecorderProps {
  onAudioRecorded: (blob: Blob) => void;
}

export const AudioRecorder = ({ onAudioRecorded }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      // Implement actual recording logic here
      const interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      
      // For demo purposes, we'll stop after 5 seconds
      setTimeout(() => {
        clearInterval(interval);
        stopRecording();
      }, 5000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setRecordingTime(0);
    // Here you would normally get the actual audio blob
    const dummyBlob = new Blob(["dummy audio data"], { type: "audio/wav" });
    onAudioRecorded(dummyBlob);
  };

  return (
    <button
      onClick={startRecording}
      className={cn(
        "p-2 rounded-full transition-all duration-200",
        isRecording ? "bg-red-500 animate-pulse" : "bg-primary hover:bg-primary/90"
      )}
    >
      <Mic className="w-5 h-5 text-white" />
      {isRecording && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
          {recordingTime}s
        </span>
      )}
    </button>
  );
};