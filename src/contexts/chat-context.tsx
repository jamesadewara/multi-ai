import { createContext, useContext, useState, useEffect } from "react";
import { AIModel, ChatMessage, Conversation } from "@/types/chat";
import { useAuth } from "./auth-context";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

// Mock AI models
export const AI_MODELS: AIModel[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    provider: "OpenAI",
    description: "Advanced language model optimized for dialogue from OpenAI.",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png",
    capabilities: ["Text generation", "Question answering", "Code assistance"],
    color: "#10A37F",
  },
  {
    id: "claude",
    name: "Claude",
    provider: "Anthropic",
    description: "Helpful, harmless, and honest AI assistant by Anthropic.",
    avatar: "https://static-00.iconduck.com/assets.00/anthropic-claude-ai-icon-512x512-4fu8jp4e.png",
    capabilities: ["Natural conversation", "Long context", "Clear reasoning"],
    color: "#8D5CD4",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    provider: "DeepSeek",
    description: "Advanced language model with deep understanding capabilities.",
    avatar: "https://pbs.twimg.com/profile_images/1706330876249202688/jlomm8gI_400x400.jpg",
    capabilities: ["Text generation", "Advanced reasoning", "Code generation"],
    color: "#0066FF",
  },
  {
    id: "mistral",
    name: "Mistral",
    provider: "Mistral AI",
    description: "Advanced multilingual language model with strong reasoning.",
    avatar: "https://avatars.githubusercontent.com/u/130738499?s=200&v=4",
    capabilities: ["Multi-language support", "Reasoning", "Creative writing"],
    color: "#4E484F",
  },
];

// Mock conversation templates
const INITIAL_CONVERSATION_TEMPLATES: Record<string, ChatMessage[]> = {
  chatgpt: [
    {
      id: "welcome-chatgpt",
      role: "assistant",
      content: "Hello! I'm ChatGPT, an AI assistant by OpenAI. How can I help you today?",
      timestamp: new Date(),
    },
  ],
  claude: [
    {
      id: "welcome-claude",
      role: "assistant",
      content: "Hi there! I'm Claude, an AI assistant by Anthropic. I'm designed to be helpful, harmless, and honest. What would you like to talk about?",
      timestamp: new Date(),
    },
  ],
  deepseek: [
    {
      id: "welcome-deepseek",
      role: "assistant",
      content: "Greetings! I'm DeepSeek, an advanced AI designed for deep understanding. I can help with a wide range of tasks and discussions. What's on your mind?",
      timestamp: new Date(),
    },
  ],
  mistral: [
    {
      id: "welcome-mistral",
      role: "assistant",
      content: "Bonjour! I'm Mistral, a multilingual AI assistant by Mistral AI. I'm here to help with your questions in multiple languages. How may I assist you?",
      timestamp: new Date(),
    },
  ],
};

interface ChatContextType {
  conversations: Conversation[];
  currentConversationId: string | null;
  aiModels: AIModel[];
  selectedModel: AIModel;
  isProcessing: boolean;
  messages: ChatMessage[];
  maxFileSize: number;
  setSelectedModel: (model: AIModel) => void;
  optimizeMediaUploads: boolean;
  sendMessage: (content: string, media?: File[]) => Promise<void>;
  createNewConversation: (modelId?: string) => void;
  loadConversation: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;
  deleteMessage: (id: string) => void;
  updateMessage: (id: string, content: string) => void;
  setOptimizeMediaUploads: (value: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<AIModel>(AI_MODELS[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [maxFileSize] = useState(() => {
    // Dynamic file size limit based on device memory if available
    if (typeof window !== 'undefined' && 'deviceMemory' in navigator) {
      // Cap at 1GB even for devices with more memory
      return Math.min(1024 * 1024 * 1024, ((navigator as any).deviceMemory ?? 4) * 256 * 1024 * 1024);
    }
    // Default to 512MB if we can't detect device memory
    return 512 * 1024 * 1024;
  });

  const [optimizeMediaUploads, setOptimizeMediaUploads] = useState(true);

  // Get current messages based on active conversation
  const messages = conversations.find(c => c.id === currentConversationId)?.messages || [];

  // Load conversations from localStorage when user logs in
  useEffect(() => {
    if (user) {
      const savedConversations = localStorage.getItem(`multiAI-conversations-${user.id}`);
      if (savedConversations) {
        try {
          const parsedConvos = JSON.parse(savedConversations);
          // Convert timestamp strings back to Date objects
          const convoWithDates = parsedConvos.map((convo: any) => ({
            ...convo,
            messages: convo.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
              media: msg.media || [],
            })),
            createdAt: new Date(convo.createdAt),
            updatedAt: new Date(convo.updatedAt),
          }));
          setConversations(convoWithDates);

          // Set current conversation if available
          if (convoWithDates.length > 0) {
            setCurrentConversationId(convoWithDates[0].id);
            // Set selected model based on conversation
            const model = AI_MODELS.find(m => m.id === convoWithDates[0].modelId);
            if (model) {
              setSelectedModel(model);
            }
          } else {
            createNewConversation();
          }
        } catch (error) {
          console.error("Failed to parse saved conversations:", error);
          createNewConversation();
        }
      } else {
        createNewConversation();
      }
    } else {
      // Reset state when user logs out
      setConversations([]);
      setCurrentConversationId(null);
      setSelectedModel(AI_MODELS[0]);
    }
  }, [user]);

  // Save conversations to localStorage
  useEffect(() => {
    if (user && conversations.length > 0) {
      localStorage.setItem(`multiAI-conversations-${user.id}`, JSON.stringify(conversations));
    }
  }, [conversations, user]);

    // Process media files function
    const processMediaFiles = async (files: File[]): Promise<{id: string, name: string, type: string, dataUrl: string}[]> => {
      const results = [];
      const GB = 1024 * 1024 * 1024;
      
      // Process files sequentially to avoid memory overload
      for (const file of files) {
        try {
          if (file.size > maxFileSize) {
            const sizeInGB = (file.size / GB).toFixed(2);
            toast.error(`File too large (${sizeInGB}GB)`);
            continue;
          }
    
          // Process in chunks for large files
          const result = await new Promise<{id: string, name: string, type: string, dataUrl: string}>((resolve, reject) => {
            const fileId = uuidv4();
            const chunkSize = 5 * 1024 * 1024; // 5MB chunks
            const chunks = Math.ceil(file.size / chunkSize);
            let currentChunk = 0;
            let completeData = '';
    
            const processChunk = (chunkStart: number) => {
              const chunkEnd = Math.min(chunkStart + chunkSize, file.size);
              const chunk = file.slice(chunkStart, chunkEnd);
              const chunkReader = new FileReader();
    
              chunkReader.onload = (e) => {
                if (!e.target?.result) {
                  reject(new Error('Chunk read failed'));
                  return;
                }
    
                completeData += (e.target.result as string).split(',')[1];
                currentChunk++;
    
                if (currentChunk < chunks) {
                  // Process next chunk
                  setTimeout(() => processChunk(currentChunk * chunkSize), 0);
                } else {
                  // All chunks processed
                  resolve({
                    id: fileId,
                    name: file.name,
                    type: file.type,
                    dataUrl: `data:${file.type};base64,${completeData}`
                  });
                }
              };
    
              chunkReader.onerror = () => {
                reject(new Error('Failed to read chunk'));
              };
    
              chunkReader.readAsDataURL(chunk);
            };
    
            // Start processing first chunk
            processChunk(0);
          });
    
          results.push(result);
        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error);
          toast.error(`Failed to process ${file.name}`);
        }
      }
      
      return results;
    };
    

  // Generate an AI response
  const generateResponse = async (userInput: string, media?: { name: string, type: string, dataUrl: string }[]): Promise<string> => {
    // Simulate network delay
    const delay = Math.random() * 1000 + 1000;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Simple responses based on input, AI model, and media
    const greetings = ["hello", "hi", "hey", "greetings"];
    const questions = ["how", "what", "why", "when", "where", "who"];
    const lowerInput = userInput.toLowerCase();

    // If media is included, acknowledge it
    if (media && media.length > 0) {
      const fileTypes = media.map(m => m.type.split('/')[0]).join(', ');
      return `I've received your message along with ${media.length} ${media.length === 1 ? 'file' : 'files'} (${fileTypes}). As ${selectedModel.name}, I'll analyze both your text and the uploaded content. What would you like me to help you with regarding these files?`;
    }

    if (greetings.some(g => lowerInput.includes(g))) {
      return `Hello! How can I assist you today as ${selectedModel.name}?`;
    } else if (lowerInput.includes("name")) {
      return `I'm ${selectedModel.name}, an AI assistant by ${selectedModel.provider}.`;
    } else if (lowerInput.includes("help")) {
      return `I'd be happy to help! As ${selectedModel.name}, I can ${selectedModel.capabilities.join(", ")}. Just let me know what you need assistance with.`;
    } else if (questions.some(q => lowerInput.startsWith(q))) {
      return `That's an interesting question. As ${selectedModel.name}, I'd say it depends on multiple factors. Can you provide more context so I can give you a more accurate answer?`;
    } else {
      return `Thanks for your message! As ${selectedModel.name} from ${selectedModel.provider}, I've processed your input: "${userInput}". Is there anything specific you'd like to know more about?`;
    }
  };

  // Create a new conversation
  const createNewConversation = (modelId: string = selectedModel.id) => {
    if (!user) return;

    const model = AI_MODELS.find(m => m.id === modelId) || AI_MODELS[0];
    setSelectedModel(model);

    const newConversation: Conversation = {
      id: `conv_${Date.now()}`,
      title: "New Conversation",
      modelId: model.id,
      messages: [...INITIAL_CONVERSATION_TEMPLATES[model.id]],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id); // This line is crucial
  };
  // Load an existing conversation
  const loadConversation = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setCurrentConversationId(conversationId);
      const model = AI_MODELS.find(m => m.id === conversation.modelId);
      if (model) {
        setSelectedModel(model);
      }
    }
  };

  // Delete a conversation
  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));

    if (currentConversationId === conversationId) {
      const remainingConversations = conversations.filter(c => c.id !== conversationId);
      if (remainingConversations.length > 0) {
        setCurrentConversationId(remainingConversations[0].id);
        const model = AI_MODELS.find(m => m.id === remainingConversations[0].modelId);
        if (model) {
          setSelectedModel(model);
        }
      } else {
        createNewConversation();
      }
    }

  };

  // Handle model change
  const handleModelChange = (model: AIModel) => {
    setSelectedModel(model);

    // Update current conversation model
    if (currentConversationId) {
      setConversations(prev =>
        prev.map(c =>
          c.id === currentConversationId
            ? { ...c, modelId: model.id, updatedAt: new Date() }
            : c
        )
      );
    }
  };

  // Send a message
  const sendMessage = async (content: string, media?: File[]) => {
    if (!user || !currentConversationId) {
      toast.error('Authentication required', { description: 'Please sign in to send messages' });
      return;
    }
    if (!content.trim() && (!media || media.length === 0)) {
      toast.warning('Empty message', { description: 'Please enter a message or attach a file' });
      return;
    };

    try {
      // Create new conversation if none exists
      if (conversations.length === 0) {
        createNewConversation();
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      let processedMedia;

      // Process media files if any
      if (media && media.length > 0) {
        try {
          if (optimizeMediaUploads && media.length > 3) {
            toast.info('Optimizing large upload...', {
              description: `Processing ${media.length} files in batches`
            });
            // Process in batches of 3
            const batchSize = 3;
            for (let i = 0; i < media.length; i += batchSize) {
              const batch = media.slice(i, i + batchSize);
              const batchProcessed = await processMediaFiles(batch);
              processedMedia = [...(processedMedia || []), ...batchProcessed];
            }
          } else {
            processedMedia = await processMediaFiles(media);
          }
          if (processedMedia.length === 0 && media.length > 0) {
            toast.warning('No valid attachments', { description: 'None of the files could be processed' });
          }
        } catch (error) {
          console.error("Media processing failed:", error);
          toast.error('Attachment error', { description: 'Failed to process attachments' });
          processedMedia = undefined;
        }
      }

      // Add user message
      const userMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: "user",
        content,
        media: processedMedia,
        timestamp: new Date(),
      };

      setConversations(prev => {
        // If there are no conversations yet, create one
        if (prev.length === 0) {
          const newConversation: Conversation = {
            id: `conv_${Date.now()}`,
            title: content.slice(0, 30) || "New Conversation",
            modelId: selectedModel.id,
            messages: [userMessage],
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          return [newConversation];
        }

        // Otherwise update the current conversation
        return prev.map(c =>
          c.id === currentConversationId
            ? {
              ...c,
              messages: [...c.messages, userMessage],
              updatedAt: new Date(),
              title: c.messages.length <= 1 ? content.slice(0, 30) || "Media Upload" : c.title,
            }
            : c
        );
      });

      // Generate AI response
      setIsProcessing(true);
      try {
        const responseText = await generateResponse(content, processedMedia);

        const aiMessage: ChatMessage = {
          id: `msg_${Date.now() + 1}`,
          role: "assistant",
          content: responseText,
          timestamp: new Date(),
        };

        setConversations(prev =>
          prev.map(c =>
            c.id === currentConversationId
              ? {
                ...c,
                messages: [...c.messages, aiMessage],
                updatedAt: new Date(),
              }
              : c
          )
        );
      } catch (error) {
        console.error("Failed to generate response:", error);
      } finally {
        setIsProcessing(false);
      }

    } catch (error) {
      console.error("Message sending failed:", error);
      toast.error('Message failed', { description: 'Could not send your message' });
    }
  };

  const deleteMessage = (messageId: string) => {
    setConversations(prev =>
      prev.map(c =>
        c.id === currentConversationId
          ? {
            ...c,
            messages: c.messages.filter(m => m.id !== messageId),
            updatedAt: new Date(),
          }
          : c
      )
    );
  };

  const updateMessage = (messageId: string, newContent: string) => {
    setConversations(prev =>
      prev.map(c =>
        c.id === currentConversationId
          ? {
            ...c,
            messages: c.messages.map(m =>
              m.id === messageId ? { ...m, content: newContent } : m
            ),
            updatedAt: new Date(),
          }
          : c
      )
    );
  };

  const value = {
    conversations,
    currentConversationId,
    aiModels: AI_MODELS,
    selectedModel,
    isProcessing,
    messages,
    maxFileSize, 
    optimizeMediaUploads,
    setSelectedModel: handleModelChange,
    sendMessage,
    createNewConversation,
    loadConversation,
    deleteConversation,
    deleteMessage,
    updateMessage,
    setOptimizeMediaUploads
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}