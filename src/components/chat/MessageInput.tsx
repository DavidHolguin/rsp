import { useRef } from "react";
import { Send, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AudioRecorderWhatsApp } from "./AudioRecorderWhatsApp";
import EmojiPicker from 'emoji-picker-react';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onAudioRecorded: (audioBlob: Blob, transcription?: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const MessageInput = ({
  value,
  onChange,
  onSend,
  onKeyPress,
  onAudioRecorded,
  inputRef
}: MessageInputProps) => {
  const handleEmojiClick = (emojiData: any) => {
    const emoji = emojiData.emoji;
    const cursorPosition = inputRef.current?.selectionStart || 0;
    const updatedValue = 
      value.slice(0, cursorPosition) + 
      emoji + 
      value.slice(cursorPosition);
    onChange(updatedValue);
    inputRef.current?.focus();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 border-t dark:border-gray-700 bg-[#1F2C34] dark:bg-[#1F2C34]">
      <div className="flex items-center space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-gray-300 hover:text-gray-100"
            >
              <Smile className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-full p-0" 
            side="top" 
            align="start"
          >
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              width="100%"
              height="350px"
            />
          </PopoverContent>
        </Popover>
        
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Escribe un mensaje..."
          className="flex-1 dark:bg-[#2A3942] dark:text-white dark:border-gray-700 rounded-full"
        />
        
        {value.trim() ? (
          <Button 
            onClick={onSend} 
            className="bg-[#00A884] hover:bg-[#00A884]/90 rounded-full"
            size="icon"
          >
            <Send className="w-5 h-5" />
          </Button>
        ) : (
          <AudioRecorderWhatsApp 
            onAudioRecorded={onAudioRecorded}
            onCancel={() => {}}
          />
        )}
      </div>
    </div>
  );
};