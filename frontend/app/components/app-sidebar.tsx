import { Link } from "react-router";
import { SidebarHistory } from "~/components/sidebar-history";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "~/components/ui/sidebar";

export function AppSidebar() {
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
      <ScrollArea className="min-h-0">
        <SidebarContent className="w-(--sidebar-width)">
          <SidebarHistory />
        </SidebarContent>
      </ScrollArea>
    </Sidebar>
  );
}
