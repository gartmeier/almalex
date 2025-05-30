import { LogIn, Trash2 } from "lucide-react";
import { Suspense } from "react";
import {
  Await,
  NavLink,
  useLoaderData,
  useNavigate,
  useRevalidator,
} from "react-router";
import { deleteChat } from "~/lib/api";
import { cn } from "~/lib/utils/tailwind";
import type { loader } from "./chat";

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

function ChatHistory() {
  let { chat, chatHistory } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const revalidator = useRevalidator();

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await deleteChat({ path: { chat_id: chatId } });

      if (chat.id === chatId) {
        navigate("/chat", { replace: true });
      } else {
        revalidator.revalidate();
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4">
      <h3 className="text-base-content/70 mb-3 text-sm font-medium">
        Recent Chats
      </h3>
      <div className="space-y-2">
        <Suspense
          fallback={
            <div className="text-base-content/50 flex items-center gap-3 p-2 text-sm">
              <span>Loading chats...</span>
            </div>
          }
        >
          <Await resolve={chatHistory}>
            {(items) =>
              items.length > 0 ? (
                items.map((chat) => (
                  <div key={chat.id} className="group relative">
                    <NavLink
                      to={`/chat/${chat.id}`}
                      className={({ isActive }) =>
                        cn(
                          "flex cursor-pointer items-center gap-3 rounded-lg p-2 text-sm group-hover:pr-10",
                          isActive ? "bg-base-300" : "hover:bg-base-300",
                        )
                      }
                      title={chat.title || "New chat"}
                    >
                      <span className="truncate">
                        {chat.title || "New chat"}
                      </span>
                    </NavLink>
                    <button
                      onClick={(e) => handleDeleteChat(chat.id, e)}
                      className="hover:bg-base-100 absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 opacity-0 transition-opacity group-hover:opacity-100"
                      title="Delete chat"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-base-content/50 flex items-center gap-3 p-2 text-sm">
                  <span>No chats yet</span>
                </div>
              )
            }
          </Await>
        </Suspense>
      </div>
    </div>
  );
}
