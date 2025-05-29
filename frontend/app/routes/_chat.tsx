import { Outlet } from "react-router";
import { Sidebar } from "~/components/layout/sidebar";

export default function ChatLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  );
}