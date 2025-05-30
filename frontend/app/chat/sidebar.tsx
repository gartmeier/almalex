import { useQuery } from "@tanstack/react-query";
import { LogIn } from "lucide-react";
import { NavLink } from "react-router";
import { listChats } from "~/lib/api";
import { cn } from "~/lib/utils/tailwind";

export function Sidebar() {
  return (
    <aside className="bg-base-200 border-base-300 flex w-64 flex-col border-r p-2">
      <div className="border-base-300 border-b p-4">
        <NavLink to="/chat" className="text-base-content text-xl font-bold">
          Alma Lex
        </NavLink>
      </div>

      <div className="p-4">
        <NavLink to="/chat" className="btn btn-primary w-full gap-2">
          New Chat
        </NavLink>
      </div>

      <ChatHistory />

      <div className="p-2 pt-0">
        <button className="btn btn-ghost h-auto w-full justify-start gap-4 p-4">
          <LogIn size={16} />
          Login
        </button>
      </div>
    </aside>
  );
}

export function ChatHistory() {
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
              className={({ isActive }) =>
                cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg p-2 text-sm",
                  isActive ? "bg-base-300" : "hover:bg-base-300",
                )
              }
              title={chat.title || "New chat"}
            >
              <span className="truncate">{chat.title || "New chat"}</span>
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
