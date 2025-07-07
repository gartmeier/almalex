import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRouteLoaderData } from "react-router";
import { AppSidebar } from "~/components/app-sidebar";
import { MessageInput } from "~/components/message-input";
import { MessageList } from "~/components/message-list";
import { RateLimitAlert } from "~/components/rate-limit-alert";
import { ScrollToBottomButton } from "~/components/scroll-to-bottom-button";
import { SidebarProvider } from "~/components/ui/sidebar";
import { ScrollToBottomProvider } from "~/contexts/scroll-to-bottom";
import { readChat, type MessageResponse } from "~/lib/api";
import { nanoid } from "~/lib/nanoid";
import { parseServerSentEvents } from "~/lib/sse";
import type { Route } from "./+types/chat";

export default function Chat({ params }: Route.ComponentProps) {
  let { token } = useRouteLoaderData("root");
  let chatId = params.chatId || nanoid();
  let queryClient = useQueryClient();

  let { data } = useQuery({
    queryKey: ["chat", params.chatId],
    queryFn: async () => {
      let { data, error } = await readChat({
        path: { chat_id: params.chatId! },
      });
      if (error) {
        throw new Error(`Failed to fetch chat ${params.chatId}`);
      }
      return data!;
    },
    enabled: !!params.chatId,
    staleTime: 30 * 1000, // 30 seconds
  });

  let [messages, setMessages] = useState(data?.messages || []);

  useEffect(() => {
    if (data?.messages) {
      setMessages(data.messages);
    }
  }, [data?.messages]);

  function addMessage(message: MessageResponse) {
    setMessages((prev) => [...prev, message]);
  }

  function updateMessage(id: string, updatedMessage: MessageResponse) {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? updatedMessage : msg)),
    );
  }

  async function handleSubmit(message: string) {
    window.history.replaceState({}, "", `/chat/${chatId}`);

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

    queryClient.invalidateQueries({ queryKey: ["rateLimit"] });
  }

  return (
    <SidebarProvider>
      <AppSidebar activeChatId={chatId} />
      <main className="relative w-full">
        <ScrollToBottomProvider>
          <div className="absolute bottom-5 w-full">
            <div className="mx-auto max-w-3xl">
              <ScrollToBottomButton />
              <RateLimitAlert />
              <MessageInput onSubmit={handleSubmit} />
            </div>
          </div>
          <MessageList chatId={chatId} messages={messages} />
        </ScrollToBottomProvider>
      </main>
    </SidebarProvider>
  );
}
