import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useRouteLoaderData } from "react-router";
import { AppSidebar } from "~/components/app-sidebar";
import { ChatHeader } from "~/components/chat-header";
import { MessageInput } from "~/components/message-input";
import { MessageList } from "~/components/message-list";
import { RateLimitAlert } from "~/components/rate-limit-alert";
import { ScrollToBottomButton } from "~/components/scroll-to-bottom-button";
import { SidebarProvider } from "~/components/ui/sidebar";
import { ScrollToBottomProvider } from "~/contexts/scroll-to-bottom";
import {
  readChat,
  type MessageDetail,
  type SearchContentBlock,
  type SearchResult,
  type TextContentBlock,
} from "~/lib/api";
import { initI18n } from "~/lib/i18n";
import { nanoid } from "~/lib/nanoid";
import { parseServerSentEvents } from "~/lib/sse";
import type { Route } from "./+types/chat";

export default function Chat({ params }: Route.ComponentProps) {
  let { t } = useTranslation();
  let rootData = useRouteLoaderData("root") as {
    token?: string;
    language?: string;
  };
  let location = useLocation();
  let queryClient = useQueryClient();

  useEffect(() => {
    if (rootData?.language) {
      initI18n(rootData.language);
    }
  }, [rootData?.language]);

  let chatId = useMemo(() => params.chatId || nanoid(), [params.chatId]);

  let { data } = useQuery({
    queryKey: ["chat", params.chatId],
    queryFn: async () => {
      let { data, error } = await readChat({
        path: { chat_id: params.chatId! },
      });
      if (error) {
        throw new Error(t("chat.error.fetchFailed", { chatId: params.chatId }));
      }
      return data!;
    },
    enabled: !!params.chatId,
    staleTime: 30 * 1000,
  });

  let [messages, setMessages] = useState(data?.messages || []);
  let [isRateLimited, setIsRateLimited] = useState(false);

  useEffect(() => {
    if (data?.messages) {
      setMessages(data.messages);
    }
  }, [data?.messages]);

  useEffect(() => {
    if (location.state?.timestamp) {
      setMessages([]);
    }
  }, [location]);

  function addMessage(message: MessageDetail) {
    setMessages((prev) => [...prev, message]);
  }

  function updateMessage(id: string, updatedMessage: MessageDetail) {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? updatedMessage : msg)),
    );
  }

  async function handleSubmit(message: string) {
    window.history.replaceState({}, "", `/chat/${chatId}`);

    let userMessage: MessageDetail = {
      id: nanoid(),
      role: "user",
      content: message,
      content_blocks: [],
    };

    let searchBlock: SearchContentBlock = {
      type: "search",
      status: "in_progress",
      query: "",
      results: [],
    };

    let textBlock: TextContentBlock = {
      type: "text",
      text: "",
    };

    let assistantMessage: MessageDetail = {
      id: nanoid(),
      role: "assistant",
      content: "",
      content_blocks: [searchBlock, textBlock],
    };

    addMessage(userMessage);
    addMessage(assistantMessage);

    let response = await fetch(`/api/chats/${chatId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${rootData.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userMessage),
    });

    if (response.status === 429) {
      setIsRateLimited(true);
      setMessages((prev) => prev.slice(0, -2));
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["chats"] });

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
            document.title = `${JSON.parse(event.data)} | Alma Lex`;
            queryClient.invalidateQueries({ queryKey: ["chats"] });
            break;
          case "message_id":
            assistantMessage.id = JSON.parse(event.data) as string;
            updateMessage(assistantMessage.id, assistantMessage);
            break;
          case "message_delta":
            textBlock.text += JSON.parse(event.data) as string;
            updateMessage(assistantMessage.id, assistantMessage);
            break;
          case "search_query":
            searchBlock.query = JSON.parse(event.data) as string;
            updateMessage(assistantMessage.id, assistantMessage);
            break;
          case "search_results":
            searchBlock.results = JSON.parse(event.data) as SearchResult[];
            searchBlock.status = "completed";
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
        <ChatHeader />
        <ScrollToBottomProvider>
          <div className="absolute bottom-4 w-full px-4">
            <div className="mx-auto max-w-3xl">
              <ScrollToBottomButton />
              <RateLimitAlert isRateLimited={isRateLimited} />
              <MessageInput onSubmit={handleSubmit} />
            </div>
          </div>
          <MessageList chatId={chatId} messages={messages} />
        </ScrollToBottomProvider>
      </main>
    </SidebarProvider>
  );
}
