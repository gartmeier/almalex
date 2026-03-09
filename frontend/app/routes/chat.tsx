import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { MessageInput } from "~/components/message-input";
import { MessageList } from "~/components/message-list";
import { ScrollToBottomButton } from "~/components/scroll-to-bottom-button";
import { useChatStorage } from "~/contexts/chat-storage";
import { ScrollToBottomProvider } from "~/contexts/scroll-to-bottom";
import { useRefState } from "~/hooks/use-ref-state";
import { nanoid } from "~/lib/nanoid";
import { createSSEParser } from "~/lib/sse";
import type { TextDeltaEvent, ThinkingDeltaEvent } from "~/types";
import type {
  MessageDetail,
  ReasoningContentBlock,
  TextContentBlock,
} from "~/types/messages";
import type { Route } from "./+types/chat";

export default function Component({ params }: Route.ComponentProps) {
  let { chatId } = params;
  let location = useLocation();
  let navigate = useNavigate();
  let { t } = useTranslation();
  let { loadChat, saveChat } = useChatStorage();

  let [input, setInput] = useState("");
  let [messages, setMessages, messagesRef] = useRefState<MessageDetail[]>([]);
  let [isLoading, setIsLoading] = useState(false);

  let hasInitialized = useRef(false);
  let shouldScrollRef = useRef(false);

  // Mutable working copies for streaming — never placed directly in state
  let currentMessage = useRef<MessageDetail | null>(null);
  let currentBlock = useRef<MessageDetail["content_blocks"][number] | null>(
    null,
  );
  let pendingUpdate = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (location.state?.initialMessage) {
      sendMessage(location.state.initialMessage, true);
      navigate(location.pathname, { replace: true, state: {} });
    } else {
      loadExistingMessages();
    }
  }, []);

  useEffect(() => {
    if (shouldScrollRef.current && messages.length > 0) {
      window.scrollTo({ top: document.body.scrollHeight });
      shouldScrollRef.current = false;
    }
  }, [messages]);

  async function loadExistingMessages() {
    try {
      let chat = loadChat(chatId);
      if (!chat) {
        toast.error("Chat not found");
        navigate("/");
        return;
      }
      setMessages(chat.messages);
      shouldScrollRef.current = true;
    } catch (e) {
      toast.error("Failed to load chat");
      navigate("/");
    }
  }

  async function sendMessage(text: string, isInitial = false) {
    let userMessage: MessageDetail = {
      id: `tmp-${nanoid()}`,
      role: "user",
      content: text,
      content_blocks: [{ type: "text", text }],
    };

    if (isInitial) {
      setMessages([userMessage]);
    } else {
      setMessages((prev) => [...prev, userMessage]);
    }
    setInput("");
    setIsLoading(true);

    function rollback() {
      if (isInitial) {
        setMessages([]);
      } else {
        setMessages((prev) => prev.slice(0, -1));
      }
      setInput(text);
    }

    try {
      let res = await fetch(`/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messagesRef.current.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (res.status === 429) {
        rollback();
        toast.error(t("chat.error.rateLimited"));
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      await processStreamingResponse(res);
      saveChat({
        id: chatId,
        title: null,
        messages: messagesRef.current,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      rollback();
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  }

  function snapshotMessage(): MessageDetail {
    let msg = currentMessage.current!;
    return {
      ...msg,
      content_blocks: msg.content_blocks.map((b) => ({ ...b })),
      sources: msg.sources ? [...msg.sources] : undefined,
    };
  }

  function flushSnapshot() {
    if (!pendingUpdate.current) {
      pendingUpdate.current = true;
      requestAnimationFrame(() => {
        setMessages((prev) => {
          let next = [...prev];
          next[next.length - 1] = snapshotMessage();
          return next;
        });
        pendingUpdate.current = false;
      });
    }
  }

  async function processStreamingResponse(response: Response) {
    let reader = response.body!.getReader();
    let parse = createSSEParser();

    currentMessage.current = {
      id: `tmp-${nanoid()}`,
      role: "assistant",
      content: "",
      content_blocks: [],
    };
    currentBlock.current = null;

    // Add empty placeholder to state
    setMessages((prev) => [...prev, snapshotMessage()]);

    while (true) {
      let { done, value } = await reader.read();
      let events = parse(value || new Uint8Array(), done);

      for (let event of events) {
        switch (event.type) {
          case "text_delta":
            handleTextDelta(event);
            break;
          case "thinking_delta":
            handleThinkingDelta(event);
            break;
          case "sources":
            currentMessage.current!.sources = event.sources;
            flushSnapshot();
            break;
        }
      }

      if (done) break;
    }

    // Build content string for follow-up API calls
    let msg = currentMessage.current!;
    msg.content = msg.content_blocks
      .filter((b): b is TextContentBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    // Final immutable snapshot
    setMessages((prev) => {
      let next = [...prev];
      next[next.length - 1] = snapshotMessage();
      return next;
    });
  }

  function handleTextDelta(event: TextDeltaEvent) {
    let msg = currentMessage.current!;
    if (currentBlock.current?.type !== "text") {
      let block: TextContentBlock = { type: "text", text: event.delta };
      currentBlock.current = block;
      msg.content_blocks.push(block);
    } else {
      (currentBlock.current as TextContentBlock).text += event.delta;
    }
    flushSnapshot();
  }

  function handleThinkingDelta(event: ThinkingDeltaEvent) {
    let msg = currentMessage.current!;
    if (currentBlock.current?.type !== "reasoning") {
      let block: ReasoningContentBlock = {
        type: "reasoning",
        text: event.delta,
      };
      currentBlock.current = block;
      msg.content_blocks.push(block);
    } else {
      (currentBlock.current as ReasoningContentBlock).text += event.delta;
    }
    flushSnapshot();
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
              onSubmit={sendMessage}
            />
          </div>
        </div>
      </div>
    </ScrollToBottomProvider>
  );
}
