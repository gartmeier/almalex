import { AppSidebar } from "~/components/app-sidebar";
import { MessageInput } from "~/components/message-input";
import { MessageList } from "~/components/message-list";
import { SidebarProvider } from "~/components/ui/sidebar";

export function loader() {}

export async function clientLoader() {}

export function HydrationFallback() {}

export default function Chat() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <MessageInput />
        <MessageList />
      </main>
    </SidebarProvider>
  );
}
