import { Trash2 } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
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
  useSidebar,
} from "~/components/ui/sidebar";
import type { ChatListItem } from "~/lib/api";

export function SidebarHistoryItem({
  chat,
  isActive,
  onDelete,
}: {
  chat: ChatListItem;
  isActive: boolean;
  onDelete: (chat: ChatListItem) => void;
}) {
  const chatTitle = chat.title || "New chat";
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();
  const { setOpenMobile } = useSidebar();

  function handleDelete() {
    setShowDialog(false);
    onDelete(chat);
  }

  function handleChatClick(e: React.MouseEvent) {
    e.preventDefault();
    setOpenMobile(false);
    navigate(`/chat/${chat.id}`);
  }

  return (
    <>
      <SidebarMenuItem key={chat.id}>
        <SidebarMenuButton asChild isActive={isActive}>
          <button onClick={handleChatClick} title={chatTitle} className="w-full text-left">
            <span>{chatTitle}</span>
          </button>
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
              Are you sure you want to delete "{chatTitle}"? This action cannot
              be undone.
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
