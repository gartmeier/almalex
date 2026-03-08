import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { MessageInput } from "~/components/message-input";
import { MessageList } from "~/components/message-list";
import { ScrollToBottomButton } from "~/components/scroll-to-bottom-button";
import { useChatStorage } from "~/contexts/chat-storage";
import { ScrollToBottomProvider } from "~/contexts/scroll-to-bottom";
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
  let [messages, setMessages] = useState<MessageDetail[]>([]);
  let [isLoading, setIsLoading] = useState(false);
  let [sources, setSources] = useState<
    { id: string; reference: string; url: string }[]
  >([]);

  let hasInitialized = useRef(false);
  let shouldScrollRef = useRef(false);

  let currentMessage = useRef<MessageDetail | null>(null);
  let currentBlock = useRef<MessageDetail["content_blocks"][number] | null>(
    null,
  );
  let pendingUpdate = useRef(false);

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
    let userMessage: MessageDetail = {
      id: `tmp-${nanoid()}`,
      role: "user",
      content: message,
      content_blocks: [{ type: "text", text: message }],
    };
    setMessages([userMessage]);
    setIsLoading(true);

    try {
      let res = await fetch(`/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: message }],
        }),
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
      saveCurrentChat();
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
      let res = await fetch(`/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...messages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            { role: "user", content: input },
          ],
        }),
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
      saveCurrentChat();
    } catch (error) {
      setInput(input);
      setMessages((prev) => prev.slice(0, -1));
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  }

  function addMessage(message: MessageDetail) {
    setMessages((prev) => [...prev, message]);
  }

  function scheduleUpdate() {
    if (!pendingUpdate.current) {
      pendingUpdate.current = true;
      requestAnimationFrame(() => {
        setMessages((prev) => [...prev]);
        pendingUpdate.current = false;
      });
    }
  }

  function saveCurrentChat() {
    let chat = {
      id: chatId,
      title: null,
      messages: messages,
      createdAt: new Date().toISOString(),
    };
    saveChat(chat);
  }

  async function processStreamingResponse(response: Response) {
    let reader = response.body!.getReader();
    let parse = createSSEParser();

    let message: MessageDetail = {
      id: `tmp-${nanoid()}`,
      role: "assistant",
      content: "",
      content_blocks: [],
    };
    currentMessage.current = message;
    currentBlock.current = null;
    setSources([]);
    setMessages((prev) => [...prev, message]);

    while (true) {
      let { done, value } = await reader.read();

      let events = parse(value || new Uint8Array(), done);

      for (let event of events) {
        switch (event.type) {
          case "text_delta":
            handleTextDeltaEvent(event);
            break;
          case "thinking_delta":
            handleThinkingDeltaEvent(event);
            break;
          case "sources":
            setSources(event.sources);
            break;
        }
      }

      if (done) {
        break;
      }
    }
  }

  function handleTextDeltaEvent(event: TextDeltaEvent) {
    if (currentBlock.current?.type !== "text") {
      let block: TextContentBlock = { type: "text", text: event.delta };
      currentBlock.current = block;
      currentMessage.current!.content_blocks.push(block);
    } else {
      (currentBlock.current as TextContentBlock).text += event.delta;
    }
    scheduleUpdate();
  }

  function handleThinkingDeltaEvent(event: ThinkingDeltaEvent) {
    if (currentBlock.current?.type !== "reasoning") {
      let block: ReasoningContentBlock = {
        type: "reasoning",
        text: event.delta,
      };
      currentBlock.current = block;
      currentMessage.current!.content_blocks.push(block);
    } else {
      (currentBlock.current as ReasoningContentBlock).text += event.delta;
    }
    scheduleUpdate();
  }

  return (
    <ScrollToBottomProvider>
      <div className="mx-auto max-w-3xl px-4 pb-[82px]">
        <MessageList messages={messages} />
        {sources.length > 0 && (
          <div className="my-2">
            <p className="text-muted-foreground text-xs font-medium">Sources</p>
            <ul className="text-muted-foreground text-xs">
              {sources.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {s.reference}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
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
