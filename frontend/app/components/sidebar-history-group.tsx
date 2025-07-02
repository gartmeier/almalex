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
  activeChatId,
  onDelete,
}: {
  label: string;
  chats: ChatListItem[];
  activeChatId: string;
  onDelete: (chat: ChatListItem) => void;
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
            <SidebarHistoryItem
              key={chat.id}
              chat={chat}
              isActive={chat.id === activeChatId}
              onDelete={onDelete}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
