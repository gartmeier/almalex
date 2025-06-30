import { SidebarHistoryItem } from "~/components/sidebar-history-item";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "~/components/ui/sidebar";
import type { ChatListItem } from "~/lib/api";

export function SidebarHistoryGroup({
  label,
  chats,
}: {
  label: string;
  chats: ChatListItem[];
}) {
  if (chats.length === 0) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {chats.map((chat) => (
            <SidebarHistoryItem key={chat.id} chat={chat} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
