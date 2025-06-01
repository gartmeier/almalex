import { isToday, isYesterday, subMonths, subWeeks } from "date-fns";
import { LogIn, Trash2 } from "lucide-react";
import { NavLink, useNavigate, useParams } from "react-router";
import type { ChatListItem } from "~/lib/api";
import { useChats, useDeleteChat } from "~/lib/hooks/use-chats";
import { cn } from "~/lib/utils/tailwind";

export function Sidebar() {
  return (
    <aside className="bg-base-200 border-base-300 flex w-64 flex-col border-r p-2">
      <div className="flex h-16 items-center justify-center">
        <NavLink
          to="/chat"
          className="from-primary to-secondary bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent"
        >
          Alma Lex
        </NavLink>
      </div>

      <div className="mb-4 px-1">
        <NavLink to="/chat" className="btn btn-primary btn-block">
          New Chat
        </NavLink>
      </div>

      <ChatHistory />

      <div className="border-base-300 border-t px-1">
        <button className="btn btn-ghost btn-block h-auto justify-start gap-4 p-4">
          <LogIn size={16} />
          Login
        </button>
      </div>
    </aside>
  );
}

function ChatHistory() {
  let { data: chats, isLoading } = useChats();
  let { deleteChat } = useDeleteChat();
  let { chatId: currentChatId } = useParams();
  let navigate = useNavigate();

  async function handleDeleteChat(chatIdToDelete: string, e: React.MouseEvent) {
    await deleteChat(chatIdToDelete);

    if (currentChatId === chatIdToDelete) {
      navigate("/chat", { replace: true });
    }
  }

  function renderChatGroup(title: string, groupChats: ChatListItem[]) {
    if (groupChats.length === 0) return null;

    return (
      <div className="mb-4">
        <div className="text-base-content/70 flex h-8 items-center px-1.5 text-sm font-medium">
          {title}
        </div>
        {groupChats.map((chat) => (
          <NavLink
            key={chat.id}
            to={`/chat/${chat.id}`}
            className={({ isActive }) =>
              cn(
                "group flex h-9 items-center rounded px-2 py-1 text-sm",
                isActive ? "bg-base-300" : "hover:bg-base-300",
              )
            }
            title={chat.title || "New chat"}
          >
            <span className="grow truncate">{chat.title || "New chat"}</span>
            <div className="hidden group-hover:block">
              <button
                onClick={(e) => handleDeleteChat(chat.id, e)}
                className="btn btn-xs btn-ghost hover:btn-error"
                title="Delete chat"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </NavLink>
        ))}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="text-base-content/50 flex items-center gap-3 p-2 text-sm">
          <span>Loading chats...</span>
        </div>
      </div>
    );
  }

  if (!chats || chats.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="text-base-content/50 flex items-center gap-3 p-2 text-sm">
          <span>No chats yet</span>
        </div>
      </div>
    );
  }

  let groupedChats = groupChatsByDate(chats);

  return (
    <div className="flex-1 overflow-y-auto px-1">
      {renderChatGroup("Today", groupedChats.today)}
      {renderChatGroup("Yesterday", groupedChats.yesterday)}
      {renderChatGroup("Last Week", groupedChats.lastWeek)}
      {renderChatGroup("Last Month", groupedChats.lastMonth)}
      {renderChatGroup("Older", groupedChats.older)}
    </div>
  );
}

type GroupedChats = {
  today: ChatListItem[];
  yesterday: ChatListItem[];
  lastWeek: ChatListItem[];
  lastMonth: ChatListItem[];
  older: ChatListItem[];
};

function groupChatsByDate(chats: ChatListItem[]): GroupedChats {
  let now = new Date();
  let oneWeekAgo = subWeeks(now, 1);
  let oneMonthAgo = subMonths(now, 1);

  return chats.reduce(
    (groups, chat) => {
      let chatDate = new Date(chat.created_at);

      if (isToday(chatDate)) {
        groups.today.push(chat);
      } else if (isYesterday(chatDate)) {
        groups.yesterday.push(chat);
      } else if (chatDate > oneWeekAgo) {
        groups.lastWeek.push(chat);
      } else if (chatDate > oneMonthAgo) {
        groups.lastMonth.push(chat);
      } else {
        groups.older.push(chat);
      }

      return groups;
    },
    {
      today: [],
      yesterday: [],
      lastWeek: [],
      lastMonth: [],
      older: [],
    } as GroupedChats,
  );
}
