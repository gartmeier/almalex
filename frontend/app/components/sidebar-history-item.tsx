import { Trash2 } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import type { ChatListItem } from "~/lib/api";

export function SidebarHistoryItem({
  chat,
  onDelete,
}: {
  chat: ChatListItem;
  onDelete: (chat: ChatListItem) => void;
}) {
  const [showDialog, setShowDialog] = useState(false);

  const handleDelete = () => {
    setShowDialog(false);
    onDelete(chat);
  };

  return (
    <>
      <SidebarMenuItem key={chat.id}>
        <SidebarMenuButton asChild>
          <NavLink to={`/chat/${chat.id}`} title={chat.title || "New chat"}>
            <span>{chat.title}</span>
          </NavLink>
        </SidebarMenuButton>
        <SidebarMenuAction
          showOnHover={true}
          onClick={() => setShowDialog(true)}
        >
          <Trash2 />
        </SidebarMenuAction>
      </SidebarMenuItem>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{chat.title || "New chat"}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
