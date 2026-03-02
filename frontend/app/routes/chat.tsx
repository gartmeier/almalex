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
  type ReasoningContentBlock,
  type TextContentBlock,
  type ToolCallContentBlock,
  type ToolResultContentBlock,
} from "~/lib/api";
import { nanoid } from "~/lib/nanoid";
import { createSSEParser } from "~/lib/sse";
import type {
  ArticlesEvent,
  ArticleSource,
  DecisionsEvent,
  DecisionSource,
  ReasoningDeltaEvent,
  TextDeltaEvent,
  ToolCallEvent,
  ToolResultEvent,
} from "~/types";
import type { Route } from "./+types/chat";

export default function Component({ params }: Route.ComponentProps) {
  let { chatId } = params;
  let location = useLocation();
  let navigate = useNavigate();
  let { t } = useTranslation();

  let [input, setInput] = useState("");
  let [messages, setMessages] = useState<MessageDetail[]>([]);
  let [isLoading, setIsLoading] = useState(false);
  let [status, setStatus] = useState<string | null>(null);
  let [articles, setArticles] = useState<ArticleSource[]>([]);
  let [decisions, setDecisions] = useState<DecisionSource[]>([]);

  let hasInitialized = useRef(false);
  let shouldScrollRef = useRef(false);

  let currentMessage = useRef<MessageDetail | null>(null);
  let currentBlock = useRef<MessageDetail["content_blocks"][number] | null>(null);
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
    setStatus(null);
    setArticles([]);
    setDecisions([]);
    setMessages((prev) => [...prev, message]);

    while (true) {
      let { done, value } = await reader.read();

      let events = parse(value || new Uint8Array(), done);

      for (let event of events) {
        switch (event.type) {
          case "reasoning":
            handleReasoningDeltaEvent(event);
            break;
          case "text":
            handleTextDeltaEvent(event);
            break;
          case "tool_call":
            handleToolCallEvent(event);
            break;
          case "tool_result":
            handleToolResultEvent(event);
            break;
          case "status":
            setStatus(event.status);
            break;
          case "articles":
            setArticles(event.articles);
            break;
          case "decisions":
            setDecisions(event.decisions);
            break;
        }
      }

      if (done) {
        break;
      }
    }
  }

  function handleReasoningDeltaEvent(event: ReasoningDeltaEvent) {
    if (currentBlock.current?.type !== "reasoning") {
      let block: ReasoningContentBlock = { type: "reasoning", text: event.delta };
      currentBlock.current = block;
      currentMessage.current!.content_blocks.push(block);
    } else {
      (currentBlock.current as ReasoningContentBlock).text += event.delta;
    }
    scheduleUpdate();
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

  function handleToolCallEvent(event: ToolCallEvent) {
    let block: ToolCallContentBlock = {
      type: "tool_call",
      id: event.id,
      name: event.name,
      arguments: event.arguments,
    };
    currentMessage.current!.content_blocks.push(block);
    currentBlock.current = null;
    scheduleUpdate();
  }

  function handleToolResultEvent(event: ToolResultEvent) {
    let block: ToolResultContentBlock = {
      type: "tool_result",
      tool_call_id: event.tool_call_id,
      result: event.result,
    };
    currentMessage.current!.content_blocks.push(block);
    scheduleUpdate();
  }

  return (
    <ScrollToBottomProvider>
      <div className="mx-auto max-w-3xl px-4 pb-[82px]">
        <MessageList messages={messages} />
        {status && (
          <p className="text-muted-foreground my-2 text-sm">{status}...</p>
        )}
        {articles.length > 0 && (
          <div className="my-2">
            <p className="text-muted-foreground text-xs font-medium">
              Articles
            </p>
            <ul className="text-muted-foreground text-xs">
              {articles.map((a) => (
                <li key={a.article_id}>{a.citation}</li>
              ))}
            </ul>
          </div>
        )}
        {decisions.length > 0 && (
          <div className="my-2">
            <p className="text-muted-foreground text-xs font-medium">
              Decisions
            </p>
            <ul className="text-muted-foreground text-xs">
              {decisions.map((d) => (
                <li key={d.decision_id}>
                  {d.html_url ? (
                    <a
                      href={d.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {d.citation}
                    </a>
                  ) : (
                    d.citation
                  )}
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
