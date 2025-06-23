import { Trash2 } from "lucide-react";
import { NavLink } from "react-router";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import type { ChatListItem } from "~/lib/api";
import { useDeleteChatMutation } from "~/lib/hooks/use-chats";

export function SidebarHistoryItem({ chat }: { chat: ChatListItem }) {
  let deleteChatMutation = useDeleteChatMutation();

  return (
    <SidebarMenuItem key={chat.id}>
      <SidebarMenuButton asChild>
        <NavLink to={`/chat/${chat.id}`} title={chat.title || "New chat"}>
          <span>{chat.title}</span>
        </NavLink>
      </SidebarMenuButton>
      <SidebarMenuAction
        showOnHover={true}
        onClick={() => deleteChatMutation.mutate(chat.id)}
      >
        <Trash2 />
      </SidebarMenuAction>
    </SidebarMenuItem>
  );
}
