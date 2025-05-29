import { MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { listChats } from "~/lib/api";
import { NavLink } from "react-router";

export function SidebarHistory() {
  const { data: chats = [], isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const { data } = await listChats();
      return data || [];
    },
  });

  return (
    <div className="flex-1 px-4 pb-4">
      <h3 className="text-sm font-medium text-base-content/70 mb-3">Recent Chats</h3>
      <div className="space-y-2">
        {isLoading ? (
          <div className="flex items-center gap-3 p-2 text-sm text-base-content/50">
            <MessageSquare size={14} />
            <span>Loading chats...</span>
          </div>
        ) : chats.length > 0 ? (
          chats.map((chat) => (
            <NavLink
              key={chat.id}
              to={`/chat/${chat.id}`}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-300 cursor-pointer text-sm"
            >
              <MessageSquare size={14} className="text-base-content/50" />
              <span className="truncate">{chat.title || "Untitled Chat"}</span>
            </NavLink>
          ))
        ) : (
          <div className="flex items-center gap-3 p-2 text-sm text-base-content/50">
            <MessageSquare size={14} />
            <span>No chats yet</span>
          </div>
        )}
      </div>
    </div>
  );
}