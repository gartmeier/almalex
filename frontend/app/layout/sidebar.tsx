import { PenBox, MessageSquare, LogIn } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 flex flex-col">
      <div className="p-4 border-b border-base-300">
        <a href="/" className="text-xl font-bold text-base-content">
          Alma Lex
        </a>
      </div>
      
      <div className="p-4">
        <button className="btn btn-primary w-full gap-2">
          <PenBox size={16} />
          New Chat
        </button>
      </div>
      
      <div className="flex-1 px-4 pb-4">
        <h3 className="text-sm font-medium text-base-content/70 mb-3">Recent Chats</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-300 cursor-pointer text-sm">
            <MessageSquare size={14} className="text-base-content/50" />
            <span className="truncate">Sample conversation about...</span>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-300 cursor-pointer text-sm">
            <MessageSquare size={14} className="text-base-content/50" />
            <span className="truncate">Another chat example...</span>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-300 cursor-pointer text-sm">
            <MessageSquare size={14} className="text-base-content/50" />
            <span className="truncate">Legal advice discussion...</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-base-300">
        <button className="btn btn-outline w-full gap-2">
          <LogIn size={16} />
          Login
        </button>
      </div>
    </aside>
  );
}