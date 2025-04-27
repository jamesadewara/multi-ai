
import { useState } from "react";
import { useChat } from "@/contexts/chat-context";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, ChevronLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { AIModel } from "@/types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/auth-context";
import { UserSettingsDrawer } from "./user-settings-drawer";

interface ChatSidebarProps {
  isOpen?: boolean;
  onCollapse?: () => void;
}

export function ChatSidebar({ isOpen = true, onCollapse }: ChatSidebarProps) {
  const { user } = useAuth();
  const { 
    conversations, 
    currentConversationId, 
    createNewConversation, 
    loadConversation,
    deleteConversation,
    aiModels
  } = useChat();
  
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  
  // Get model info for each conversation
  const getModelForConversation = (modelId: string): AIModel => {
    return aiModels.find(m => m.id === modelId) || aiModels[0];
  };

  const handleDeleteClick = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    setConfirmDelete(conversationId);
  };

  const confirmDeleteConversation = () => {
    if (confirmDelete) {
      deleteConversation(confirmDelete);
      setConfirmDelete(null);
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground border-r w-64">
      {/* Header */}
      <div className="px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img 
            src="/images/multi-ai.png" 
            alt="MultiAI Logo" 
            className="w-8 h-8" 
          />
          <h1 className="font-bold text-xl">MultiAI</h1>
        </div>
        {onCollapse && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onCollapse}
            className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/80"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      {/* New Chat Button */}
      <div className="px-4 py-2">
        <Button 
          onClick={() => createNewConversation()} 
          className="w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>
      
      <Separator className="my-2 bg-sidebar-border" />
      
      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="px-2 py-2 space-y-1">
          {conversations.map((conversation) => {
            const model = getModelForConversation(conversation.modelId);
            return (
              <div
                key={conversation.id}
                onClick={() => loadConversation(conversation.id)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors",
                  conversation.id === currentConversationId
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent/50 text-sidebar-foreground/90"
                )}
              >
                <Avatar className="h-6 w-6 flex-shrink-0">
                  <AvatarImage src={model.avatar} alt={model.name} />
                  <AvatarFallback className="text-xs bg-sidebar-primary text-sidebar-primary-foreground">
                    {model.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 truncate">
                  <div className="flex justify-between items-start">
                    <p className="truncate text-sm font-medium">
                      {conversation.title || "New Conversation"}
                    </p>
                  </div>
                  <p className="text-xs text-sidebar-foreground/70 truncate">
                    {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/80"
                  onClick={(e) => handleDeleteClick(e, conversation.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      
      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border">
        {user && (
          <UserSettingsDrawer isMini={false}/>
        )}
      </div>

      {/* Confirm Delete Dialog */}
      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Conversation</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this conversation? This action cannot be undone.</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteConversation}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
