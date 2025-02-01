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
    <div className="fixed bottom-0 left-0 right-0 p-3 border-t dark:border-gray-700/50 bg-[#1F2C34] dark:bg-[#1F2C34]">
      <div className="flex items-center gap-2 mx-auto max-w-4xl">
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Mensaje"
            className="w-full dark:bg-[#2A3942] dark:text-white border-none rounded-2xl pl-12 pr-12 py-6 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 hover:bg-[#2A3942] h-10 w-10"
              >
                <Smile className="h-6 w-6" />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-full p-0 border-none shadow-lg" 
              side="top" 
              align="start"
              sideOffset={16}
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                width="100%"
                height="350px"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {value.trim() ? (
          <Button 
            onClick={onSend} 
            className="bg-[#00A884] hover:bg-[#00A884]/90 rounded-full w-12 h-12 flex items-center justify-center"
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