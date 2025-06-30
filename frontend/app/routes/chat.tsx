import { nanoid } from "nanoid";
import { useParams, useRouteLoaderData } from "react-router";
import { AppSidebar } from "~/components/app-sidebar";
import { MessageInput } from "~/components/message-input";
import { MessageList } from "~/components/message-list";
import { SidebarProvider } from "~/components/ui/sidebar";
import { useChat } from "~/hooks/use-chat";
import { parseServerSentEvents } from "~/lib/sse";

export default function Chat() {
  let { chatId } = useParams();
  let { token } = useRouteLoaderData("root");

  let { messages, addMessage, updateMessage } = useChat(chatId);

  async function handleSubmit(message: string) {
    if (!chatId) return;

    let userMessage = {
      id: nanoid(),
      role: "user",
      content: message,
    };

    let assistantMessage = {
      id: nanoid(),
      role: "assistant",
      content: "",
    };

    addMessage(userMessage);
    addMessage(assistantMessage);

    let response = await fetch(`/api/chats/${chatId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userMessage),
    });

    let reader = response.body!.getReader();
    let decoder = new TextDecoder();

    while (true) {
      let { done, value } = await reader.read();

      if (done) {
        break;
      }

      let chunk = decoder.decode(value!);
      let events = parseServerSentEvents(chunk);

      for (let event of events) {
        switch (event.name) {
          case "chat_title":
            document.title = `${event.data} | Alma Lex`;
            break;
          case "message_id":
            assistantMessage.id = event.data;
            updateMessage(assistantMessage.id, assistantMessage);
            break;
          case "message_delta":
            assistantMessage.content += event.data;
            updateMessage(assistantMessage.id, assistantMessage);
            break;
        }
      }
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="relative w-full">
        <MessageInput onSubmit={handleSubmit} />
        <MessageList messages={messages} />
      </main>
    </SidebarProvider>
  );
}
