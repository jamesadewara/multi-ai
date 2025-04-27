import { useEffect, useRef, useState } from "react";
import { useChat } from "@/contexts/chat-context";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { AISelector } from "./ai-selector";
import { useIsMobile } from "@/hooks/use-mobile";
import { useInView } from "react-intersection-observer";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";

interface ChatInterfaceProps {
  openSidebar?: () => void;
}

export function ChatInterface({ openSidebar }: ChatInterfaceProps) {
  const {
    messages,
    aiModels,
    selectedModel,
    setSelectedModel,
    sendMessage,
    isProcessing,
    deleteMessage,
    updateMessage,
  } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [scrollableRef, inView] = useInView({
    threshold: 0,
  });
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Show/hide scroll button
  useEffect(() => {
    if (!inView && messages.length > 3) {
      setShowScrollToBottom(true);
    } else {
      setShowScrollToBottom(false);
    }
  }, [inView, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const openMobileSidebarView = () => {
    openSidebar?.();
  };

  const handleDeleteMessage = (id: string) => {
    deleteMessage(id);
  };

  const handleEditMessage = (id: string, newContent: string) => {
    updateMessage(id, newContent);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 sm:p-4 border-b backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        {isMobile ? (
          <Button onClick={openMobileSidebarView}>
            <Menu className="h-5 w-5" />
          </Button>
        ) : (
          <></>
        )}

        <h2 className="text-lg sm:text-xl font-semibold">Chat with MULTI-AI</h2>
        <AISelector
          models={aiModels}
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 relative">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-4 sm:p-6 rounded-lg bg-accent/20 max-w-md glass-morphism animate-fade-in">
              <h3 className="font-medium text-lg mb-2">
                Welcome to MultiAI Chat
              </h3>
              <p className="text-muted-foreground mb-2">
                Start a conversation with {selectedModel.name} by typing a
                message below.
              </p>
              <div className="text-sm text-muted-foreground">
                <p>You can:</p>
                <ul className="list-disc pl-5 text-left mt-2">
                  <li className="animate-fade-in [animation-delay:100ms]">
                    Ask questions on any topic
                  </li>
                  <li className="animate-fade-in [animation-delay:200ms]">
                    Get help with writing or coding
                  </li>
                  <li className="animate-fade-in [animation-delay:300ms]">
                    Upload images or files for analysis
                  </li>
                  <li className="animate-fade-in [animation-delay:400ms]">
                    Switch AI models anytime
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index === messages.length - 1 ? 0 : 0,
                }}
                ref={index === messages.length - 1 ? scrollableRef : undefined}
              >
                <ChatMessage
                  message={msg}
                  aiModel={msg.role === "assistant" ? selectedModel : undefined}
                  onDelete={handleDeleteMessage}
                  onEdit={handleEditMessage}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <ChatMessage
              message={{
                id: "loading",
                content: "",
                role: "assistant",
                timestamp: new Date(),
              }}
              aiModel={selectedModel}
              isLoading
            />
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <AnimatePresence>
        {showScrollToBottom && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: -70 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-20 right-4 bg-primary text-primary-foreground rounded-full p-2 shadow-lg"
            onClick={scrollToBottom}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      <div className="p-2 sm:p-4 border-t backdrop-blur-sm bg-background/80 sticky bottom-0">
        <ChatInput  isLoading={isProcessing} />
      </div>
    </div>
  );
}