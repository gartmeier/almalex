import { PenBox, LogIn } from "lucide-react";
import { SidebarHistory } from "~/chat/sidebar-history";

export function Sidebar() {
  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 flex flex-col p-2">
      <div className="p-4 border-b border-base-300">
        <a href="/public" className="text-xl font-bold text-base-content">
          Alma Lex
        </a>
      </div>
      
      <div className="p-4">
        <button className="btn btn-primary w-full gap-2">
          <PenBox size={16} />
          New Chat
        </button>
      </div>
      
      <SidebarHistory />
      
      <div className="p-2 pt-0">
        <button className="btn btn-ghost w-full h-auto justify-start gap-4 p-4">
          <LogIn size={16} />
          Login
        </button>
      </div>
    </aside>
  );
}