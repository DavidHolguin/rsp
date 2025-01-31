export type MessageType = "text" | "image" | "audio" | "qr";

export interface Message {
  id: string;
  content: string;
  type: MessageType;
  timestamp: number;
  sender: "user" | "agent";
}

export interface ChatAnalytics {
  interactionTime: number;
  messageCount: number;
  device: string;
  platform: string;
  location?: string;
  sentiment?: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  conversations: Message[];
  analytics: ChatAnalytics;
  createdAt: number;
  lastActive: number;
}