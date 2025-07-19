import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { SidebarTrigger, useSidebar } from "~/components/ui/sidebar";
import { Plus } from "lucide-react";

export function ChatHeader() {
  let navigate = useNavigate();
  let { open, isMobile } = useSidebar();

  function handleNewChat() {
    navigate("/chat/new", { state: { timestamp: Date.now() } });
  }

  return (
    <div className="absolute top-4 left-4 z-10 flex gap-2">
      <div className="bg-background/80 backdrop-blur-sm rounded-md p-1 flex gap-1">
        <SidebarTrigger />
        {(isMobile || !open) && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="size-7"
            onClick={handleNewChat}
          >
            <Plus className="size-4" />
            <span className="sr-only">New Chat</span>
          </Button>
        )}
      </div>
    </div>
  );
}