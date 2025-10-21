import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { MessageInput } from "~/components/message-input";
import { MessageList } from "~/components/message-list";
import { ScrollToBottomButton } from "~/components/scroll-to-bottom-button";
import { ScrollToBottomProvider } from "~/contexts/scroll-to-bottom";
import {
  readChat,
  type MessageDetail,
  type SearchContentBlock,
  type SearchResult,
  type TextContentBlock,
} from "~/lib/api";
import { nanoid } from "~/lib/nanoid";
import { parseServerSentEvents, type ServerSentEvent } from "~/lib/sse";
import type { Route } from "./+types/chat";

export default function Component({ params }: Route.ComponentProps) {
  let { chatId } = params;
  let location = useLocation();
  let navigate = useNavigate();
  let { t } = useTranslation();

  let [input, setInput] = useState("");
  let [messages, setMessages] = useState<MessageDetail[]>([]);
  let [isLoading, setIsLoading] = useState(false);

  let hasInitialized = useRef(false);
  let shouldScrollRef = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) {
      return;
    }

    hasInitialized.current = true;

    if (location.state?.initialMessage) {
      handleInitialMessage(location.state.initialMessage);
      navigate(location.pathname, { replace: true, state: {} });
    } else {
      loadExistingMessages();
    }
  }, []);

  // Scroll to bottom after messages are rendered (React's equivalent of Vue's nextTick)
  useEffect(() => {
    if (shouldScrollRef.current && messages.length > 0) {
      window.scrollTo({ top: document.body.scrollHeight });
      shouldScrollRef.current = false;
    }
  }, [messages]);

  async function handleInitialMessage(message: string) {
    setMessages([
      {
        id: `tmp-${nanoid()}`,
        role: "user",
        content: message,
        content_blocks: [{ type: "text", text: message }],
      },
    ]);
    setIsLoading(true);

    try {
      let res = await fetch(`/api/chats/${chatId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chat_id: chatId, content: message }),
      });

      if (res.status === 429) {
        setMessages([]);
        setInput(message);
        toast.error(t("chat.error.rateLimited"));
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to start chat");
      }

      await processStreamingResponse(res);
    } catch (error) {
      setMessages([]);
      setInput(message);
      toast.error("Failed to start chat");
    } finally {
      setIsLoading(false);
    }
  }

  async function loadExistingMessages() {
    try {
      let res = await readChat({
        path: { chat_id: chatId },
        throwOnError: true,
      });
      setMessages(res.data.messages);
      shouldScrollRef.current = true;
    } catch (e) {
      toast.error("Failed to load chat");
      navigate("/");
    }
  }

  async function handleSubmit(input: string) {
    let newMessage: MessageDetail = {
      id: `temp-${nanoid()}`,
      role: "user",
      content: input,
      content_blocks: [{ type: "text", text: input }],
    };
    addMessage(newMessage);
    setInput("");
    setIsLoading(true);

    try {
      let res = await fetch(`/api/chats/${chatId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chat_id: chatId, content: input }),
      });

      if (res.status === 429) {
        setInput(input);
        setMessages((prev) => prev.slice(0, -1));
        toast.error(t("chat.error.rateLimited"));
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      await processStreamingResponse(res);
    } catch (error) {
      setInput(input);
      setMessages((prev) => prev.slice(0, -1));
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  }

  async function processStreamingResponse(response: Response) {
    let reader = response.body!.getReader();
    let decoder = new TextDecoder();

    let eventHandlers: Record<string, (event: ServerSentEvent) => void> = {
      message_id: handleMessageIdEvent,
      message_delta: handleMessageDeltaEvent,
      search_query: handleSearchQueryEvent,
      search_results: handleSearchResultsEvent,
    };

    while (true) {
      let { done, value } = await reader.read();

      if (done) {
        break;
      }

      let chunk = decoder.decode(value!);
      let events = parseServerSentEvents(chunk);

      for (let event of events) {
        let eventHandler = eventHandlers[event.name];
        if (eventHandler) {
          eventHandler(event);
        }
      }
    }
  }

  function handleMessageIdEvent(event: ServerSentEvent) {
    let newMessage: MessageDetail = {
      id: JSON.parse(event.data) as string,
      role: "assistant",
      content: "",
      content_blocks: [],
    };
    addMessage(newMessage);
  }

  function handleMessageDeltaEvent(event: ServerSentEvent) {
    appendToTextBlock(JSON.parse(event.data));
  }

  function handleSearchQueryEvent(event: ServerSentEvent) {
    let searchBlock: SearchContentBlock = {
      type: "search",
      status: "in_progress",
      query: JSON.parse(event.data) as string,
      results: [],
    };
    addContentBlockToLastMessage(searchBlock);
  }

  function handleSearchResultsEvent(event: ServerSentEvent) {
    updateLastContentBlock((block) => ({
      ...(block as SearchContentBlock),
      status: "completed" as const,
      results: JSON.parse(event.data) as SearchResult[],
    }));
  }

  function addMessage(message: MessageDetail) {
    setMessages((prev) => [...prev, message]);
  }

  function updateLastMessage(
    updater: (message: MessageDetail) => MessageDetail,
  ) {
    setMessages((prev) => {
      let lastMessage = prev.at(-1)!;
      let updatedMessage = updater(lastMessage);

      return [...prev.slice(0, -1), updatedMessage];
    });
  }

  function addContentBlockToLastMessage(
    block: SearchContentBlock | TextContentBlock,
  ) {
    updateLastMessage((message) => ({
      ...message,
      content_blocks: [...message.content_blocks, block],
    }));
  }

  function updateLastContentBlock(
    updater: (
      block: SearchContentBlock | TextContentBlock,
    ) => SearchContentBlock | TextContentBlock,
  ) {
    updateLastMessage((message) => {
      let lastBlock = message.content_blocks.at(-1)!;
      let updatedBlock = updater(lastBlock);

      return {
        ...message,
        content_blocks: [...message.content_blocks.slice(0, -1), updatedBlock],
      };
    });
  }

  function appendToTextBlock(text: string) {
    updateLastMessage((message) => {
      let lastBlock = message.content_blocks.at(-1)!;

      if (lastBlock.type !== "text") {
        // Add new text block if none exists
        let textBlock = {
          type: "text" as const,
          text: text,
        };
        return {
          ...message,
          content_blocks: [...message.content_blocks, textBlock],
        };
      } else {
        // Update existing text block
        let updatedTextBlock = {
          type: "text" as const,
          text: lastBlock.text + text,
        };
        return {
          ...message,
          content_blocks: [
            ...message.content_blocks.slice(0, -1),
            updatedTextBlock,
          ],
        };
      }
    });
  }

  return (
    <ScrollToBottomProvider>
      <div className="mx-auto max-w-3xl px-4 pb-[82px]">
        <MessageList messages={messages} />
      </div>
      <div className="fixed right-0 bottom-0 left-0 z-10">
        <div className="mb-2 flex justify-center">
          <ScrollToBottomButton />
        </div>
        <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-t p-4 backdrop-blur">
          <div className="mx-auto max-w-3xl">
            <MessageInput
              value={input}
              onChange={setInput}
              isLoading={isLoading}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </ScrollToBottomProvider>
  );
}
