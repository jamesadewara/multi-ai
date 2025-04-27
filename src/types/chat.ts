// types/chat.ts

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  avatar: string;
  capabilities: string[];
  color: string;
}

export interface MediaItem {
  name: string;
  type: string;
  dataUrl: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  media?: MediaItem[];
}

export interface Conversation {
  id: string;
  title: string;
  modelId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}