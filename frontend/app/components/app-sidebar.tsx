import { Link } from "react-router";
import { SidebarHistory } from "~/components/sidebar-history";
import { Button } from "~/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "~/components/ui/sidebar";

export function AppSidebar({ activeChatId }: { activeChatId: string }) {
  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className="text-center text-xl font-bold">
          <Link to="/">Alma Lex</Link>
        </h1>
        <Button asChild>
          <Link to="/">New Chat</Link>
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarHistory activeChatId={activeChatId} />
      </SidebarContent>
    </Sidebar>
  );
}
