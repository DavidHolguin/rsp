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
    quickReplies?: {
      text: string;
      action: string;
    }[];
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