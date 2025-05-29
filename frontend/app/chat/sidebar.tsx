import { LogIn, PenBox } from "lucide-react";
import { NavLink } from "react-router";
import { SidebarHistory } from "~/chat/sidebar-history";

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
          <PenBox size={16} />
          New Chat
        </NavLink>
      </div>

      <SidebarHistory />

      <div className="p-2 pt-0">
        <button className="btn btn-ghost h-auto w-full justify-start gap-4 p-4">
          <LogIn size={16} />
          Login
        </button>
      </div>
    </aside>
  );
}
