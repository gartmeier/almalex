import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MessageInput } from "~/components/message-input";
import { MessageList } from "~/components/message-list";
import { ScrollToBottomProvider } from "~/contexts/scroll-to-bottom";
import {
  readChat,
  type ChatDetail,
  type MessageDetail,
  type SearchContentBlock,
  type SearchResult,
  type TextContentBlock,
} from "~/lib/api";
import { parseServerSentEvents } from "~/lib/sse";
import type { Route } from "./+types/chat";

export default function Component({ params }: Route.ComponentProps) {
  let { t } = useTranslation();
  let [chat, setChat] = useState<ChatDetail | null>(null);
  let [input, setInput] = useState("");
  let hasStartedCompletionRef = useRef(false);

  useEffect(() => {
    async function initChat() {
      let res = await readChat({
        path: { chat_id: params.chatId },
        throwOnError: true,
      });
      setChat(res.data);

      // Start completion if chat is pending and we haven't started yet
      if (res.data.status === "pending" && !hasStartedCompletionRef.current) {
        hasStartedCompletionRef.current = true;
        startInitialCompletion(res.data);
      }
    }

    // Reset ref for new chat
    hasStartedCompletionRef.current = false;
    initChat();
  }, [params.chatId]);

  useEffect(() => {
    let title = "New chat";

    if (chat && chat.title) {
      title = chat.title;
    }

    document.title = `${title} | Alma Lex`;
  }, [chat?.title]);

  async function startInitialCompletion(initialChat: ChatDetail) {
    setChat((prev) => prev && { ...prev, status: "in_progress" });

    let response = await fetch(`/api/chats/${initialChat.id}/start`, {
      method: "POST",
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
            setChat(
              (prev) => prev && { ...prev, title: JSON.parse(event.data) },
            );
            break;
          case "message_id":
            let newMessage: MessageDetail = {
              id: JSON.parse(event.data) as string,
              role: "assistant",
              content: "",
              content_blocks: [],
            };
            addMessageToChat(newMessage);
            break;
          case "search_query":
            let searchBlock: SearchContentBlock = {
              type: "search",
              status: "in_progress",
              query: JSON.parse(event.data) as string,
              results: [],
            };
            addContentBlockToLastMessage(searchBlock);
            break;
          case "search_results":
            updateLastContentBlock((block) => ({
              ...(block as SearchContentBlock),
              status: "completed" as const,
              results: JSON.parse(event.data) as SearchResult[],
            }));
            break;
          case "message_delta":
            appendToTextBlock(JSON.parse(event.data));
            break;
        }
      }
    }

    setChat((prev) => prev && { ...prev, status: "completed" });
  }

  function handleSubmit() {
    if (!chat || chat.status !== "completed") {
      return;
    }
  }

  function addMessageToChat(message: MessageDetail) {
    setChat((prev) => {
      if (!prev) return prev;
      return { ...prev, messages: [...prev.messages, message] };
    });
  }

  function updateLastMessage(
    updater: (message: MessageDetail) => MessageDetail,
  ) {
    setChat((prev) => {
      if (!prev) return prev;

      let lastMessage = prev.messages.at(-1)!;
      let updatedMessage = updater(lastMessage);

      return {
        ...prev,
        messages: [...prev.messages.slice(0, -1), updatedMessage],
      };
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
      let textBlockIndex = message.content_blocks.findIndex(
        (block) => block.type === "text",
      );

      if (textBlockIndex === -1) {
        // Add new text block if none exists
        let textBlock: TextContentBlock = {
          type: "text",
          text: text,
        };
        return {
          ...message,
          content_blocks: [...message.content_blocks, textBlock],
        };
      } else {
        // Update existing text block
        let updatedBlocks = [...message.content_blocks];
        let textBlock = updatedBlocks[textBlockIndex] as TextContentBlock;
        updatedBlocks[textBlockIndex] = {
          ...textBlock,
          text: textBlock.text + text,
        };
        return {
          ...message,
          content_blocks: updatedBlocks,
        };
      }
    });
  }

  return (
    <>
      {chat && (
        <ScrollToBottomProvider>
          <div className="mx-auto max-w-3xl pb-[82px]">
            <MessageList chat={chat} />
            {chat.status === "pending" && (
              <div className="text-muted-foreground flex items-center gap-2 py-4 text-center">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("chat.preparingResponse")}
              </div>
            )}
          </div>
        </ScrollToBottomProvider>
      )}
      <div className="fixed right-0 bottom-0 left-0 z-10 p-4">
        <div className="mx-auto max-w-3xl">
          <MessageInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </>
  );
}
