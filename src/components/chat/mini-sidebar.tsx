
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { MessageCircle, Menu } from "lucide-react";
import { useChat } from "@/contexts/chat-context";
import { UserSettingsDrawer } from "./user-settings-drawer";
import { useAuth } from "@/contexts/auth-context";
import { ScrollArea } from "../ui/scroll-area";

interface MiniSidebarProps {
  onExpand: () => void;
}

export function MiniSidebar({ onExpand }: MiniSidebarProps) {
  const { conversations, currentConversationId, loadConversation } = useChat();
  const { user } = useAuth();

  return (
    <div className="h-full w-16 border-r bg-background flex flex-col items-center py-4 gap-2">
      <Button variant="ghost" size="icon" onClick={onExpand}>
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex-1 overflow-y-auto w-full px-2">
        <ScrollArea className="flex-1">

          <TooltipProvider>
            {conversations.map((conversation) => (
              <Tooltip key={conversation.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "w-full my-1",
                      conversation.id === currentConversationId && "bg-accent"
                    )}
                    onClick={() => loadConversation(conversation.id)}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {conversation.title || "New Conversation"}
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </ScrollArea>
      </div>
      {user && (
        <UserSettingsDrawer isMini={true} />
      )}
    </div>
  );
}
