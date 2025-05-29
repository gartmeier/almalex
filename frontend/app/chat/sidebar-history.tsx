import { useQuery } from "@tanstack/react-query";
import { MessageSquare } from "lucide-react";
import { NavLink } from "react-router";
import { listChats } from "~/lib/api";

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
      <h3 className="text-base-content/70 mb-3 text-sm font-medium">
        Recent Chats
      </h3>
      <div className="space-y-2">
        {isLoading ? (
          <div className="text-base-content/50 flex items-center gap-3 p-2 text-sm">
            <span>Loading chats...</span>
          </div>
        ) : chats.length > 0 ? (
          chats.map((chat) => (
            <NavLink
              key={chat.id}
              to={`/chat/${chat.id}`}
              className="hover:bg-base-300 flex cursor-pointer items-center gap-3 rounded-lg p-2 text-sm"
            >
              <span className="truncate">{chat.title || "Untitled Chat"}</span>
            </NavLink>
          ))
        ) : (
          <div className="text-base-content/50 flex items-center gap-3 p-2 text-sm">
            <span>No chats yet</span>
          </div>
        )}
      </div>
    </div>
  );
}
