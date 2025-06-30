import { useParams } from "react-router";
import { AppSidebar } from "~/components/app-sidebar";
import { MessageInput } from "~/components/message-input";
import { MessageList } from "~/components/message-list";
import { SidebarProvider } from "~/components/ui/sidebar";
import { useChat } from "~/hooks/use-chat";

export function loader() {}

export async function clientLoader() {}

export function HydrationFallback() {}

function generateChatId(): string {
  return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export default function Chat() {
  let { chatId } = useParams();
  let { messages } = useChat(chatId);

  function handleSubmit(message: string) {
    // TODO: Handle message submission
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <MessageInput onSubmit={handleSubmit} />
        <MessageList messages={messages} />
      </main>
    </SidebarProvider>
  );
}
