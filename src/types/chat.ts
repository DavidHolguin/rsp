export type MessageType = "text" | "image" | "audio" | "gallery" | "location" | "qr";

export interface Message {
  id: string;
  content: string;
  type: MessageType;
  timestamp: number;
  sender: "user" | "agent";
  metadata?: {
    gallery?: {
      images: {
        url: string;
        description?: string;
        name?: string;
      }[];
      layout?: "grid" | "carousel";
    };
    location?: {
      address: string;
      latitude: number;
      longitude: number;
      name?: string;
    };
    quickReplies?: string[];
    qr?: {
      data: string;
      title?: string;
    };
    actions?: {
      type: "link" | "button";
      text: string;
      url?: string;
      action?: string;
    }[];
    transcription?: string;
  };
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

export interface Chatbot {
  name: string;
  icon_url?: string;
  description?: string;
  welcome_message?: string;
  quick_questions?: string[];
}