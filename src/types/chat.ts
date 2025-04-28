export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  avatar: string;
  capabilities: string[];
  color: string;
}

export interface MediaReference {
  id: string;
  name: string;
  type: string;
  cacheId: string; // Reference to IndexedDB cache
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  media?: MediaReference[]; // Changed from dataUrl to reference
}

export interface Conversation {
  id: string;
  title: string;
  modelId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}