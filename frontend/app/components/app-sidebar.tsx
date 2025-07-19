import { Link, useNavigate } from "react-router";
import { SidebarHistory } from "~/components/sidebar-history";
import { Button } from "~/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "~/components/ui/sidebar";

export function AppSidebar({ activeChatId }: { activeChatId: string }) {
  let navigate = useNavigate();
  let { setOpenMobile } = useSidebar();

  function handleNewChat() {
    setOpenMobile(false);
    navigate("/chat/new", { state: { timestamp: Date.now() } });
  }

  return (
    <Sidebar className="border-r border-input">
      <SidebarHeader>
        <h1 className="text-center text-xl font-bold">
          <Link to="/">Alma Lex</Link>
        </h1>
        <Button onClick={handleNewChat}>New Chat</Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarHistory activeChatId={activeChatId} />
      </SidebarContent>
    </Sidebar>
  );
}
