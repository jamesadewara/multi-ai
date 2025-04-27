
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { MiniSidebar } from "@/components/chat/mini-sidebar";
import { ChatProvider } from "@/contexts/chat-context";
import { ChatInterface } from "@/components/chat/chat-interface";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  
  // On mobile, sidebar is closed by default
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  const handleSidebarCollapse = () => {
    setIsSidebarOpen(false);
  };
  
  const handleSidebarExpand = () => {
    setIsSidebarOpen(true);
  };

  return (
    <ChatProvider>
      <div className="flex h-screen">
        {/* Mobile sidebar as a sheet */}
        {isMobile ? (
          <>
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild className="md:hidden absolute top-4 left-4 z-10">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 m-0 full-transparent" showClose={false}>
                <ChatSidebar 
                  isOpen={false} 
                  onCollapse={() => setIsSidebarOpen(false)} 
                />
              </SheetContent>
            </Sheet>
          </>
        ) : (
          /* Desktop sidebar with expanded or mini mode */
          <>
            {isSidebarOpen ? (
              <ChatSidebar 
                isOpen={true} 
                onCollapse={handleSidebarCollapse} 
              />
            ) : (
              <MiniSidebar onExpand={handleSidebarExpand} />
            )}
          </>
        )}
        
        <div className="flex-1 flex flex-col">
          <ChatInterface openSidebar={() => setIsSidebarOpen(true)}/>
        </div>
      </div>
    </ChatProvider>
  );
}
