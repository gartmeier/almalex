import { PenBox, LogIn } from "lucide-react";
import { SidebarHistory } from "~/components/layout/sidebar-history";

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
      
      <SidebarHistory />
      
      <div className="p-4 border-t border-base-300">
        <button className="btn btn-outline w-full gap-2">
          <LogIn size={16} />
          Login
        </button>
      </div>
    </aside>
  );
}