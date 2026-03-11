import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { MessageInput } from "~/components/message-input";
import { MessageList } from "~/components/message-list";
import { ScrollToBottomButton } from "~/components/scroll-to-bottom-button";
import { useChatStorage } from "~/contexts/chat-storage";
import { ScrollToBottomProvider } from "~/contexts/scroll-to-bottom";
import { getStoredModel, storeModel } from "~/lib/models";
import { nanoid } from "~/lib/nanoid";
import { createSSEParser } from "~/lib/sse";
import type {
  Block,
  Message,
  TextBlock,
  ThinkingBlockData,
} from "~/types/messages";
import type { Route } from "./+types/chat";

export default function Component({ params }: Route.ComponentProps) {
  let { chatId } = params;
  let location = useLocation();
  let navigate = useNavigate();
  let { t } = useTranslation();
  let { loadChat, saveChat } = useChatStorage();

  let [input, setInput] = useState("");
  let [model, setModel] = useState(getStoredModel);

  function handleModelChange(value: string) {
    setModel(value);
    storeModel(value);
  }
  let [messages, setMessages] = useState<Message[]>([]);
  let [isLoading, setIsLoading] = useState(false);

  let hasInitialized = useRef(false);
  let shouldScrollRef = useRef(false);

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
    let userMessage: Message = {
      id: nanoid(),
      role: "user",
      content: [{ type: "text", text }],
    };

    let prevMessages = isInitial ? [] : messages;
    let withUser = [...prevMessages, userMessage];
    setMessages(withUser);
    setInput("");
    setIsLoading(true);

    try {
      let res = await fetch(`/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: withUser.map((msg) => ({
            role: msg.role,
            content: msg.content
              .filter((b): b is TextBlock => b.type === "text")
              .map((b) => b.text)
              .join(""),
          })),
          model,
        }),
      });

      if (res.status === 429) {
        setMessages(prevMessages);
        setInput(text);
        toast.error(t("chat.error.rateLimited"));
        return;
      }

      if (!res.ok) {
        toast.error("Failed to send message");
        throw new Error("Failed to send message");
      }

      let finalMessages = await processStreamingResponse(res, withUser);
      saveChat({
        id: chatId,
        messages: finalMessages,
        createdAt: new Date().toISOString(),
      });
    } catch {
      setMessages(prevMessages);
      setInput(text);
    } finally {
      setIsLoading(false);
    }
  }

  async function processStreamingResponse(
    response: Response,
    preceding: Message[],
  ): Promise<Message[]> {
    let reader = response.body!.getReader();
    let parse = createSSEParser();

    let assistantMessage: Message = {
      id: nanoid(),
      role: "assistant",
      content: [],
      status: "searching",
    };
    let currentBlock: Block | null = null;
    let pendingFlush = false;

    function flush() {
      if (!pendingFlush) {
        pendingFlush = true;
        requestAnimationFrame(() => {
          setMessages([
            ...preceding,
            { ...assistantMessage, content: [...assistantMessage.content] },
          ]);
          pendingFlush = false;
        });
      }
    }

    setMessages([...preceding, { ...assistantMessage, content: [] }]);

    while (true) {
      let { done, value } = await reader.read();
      let events = parse(value || new Uint8Array(), done);

      for (let event of events) {
        switch (event.type) {
          case "text_delta": {
            if (currentBlock?.type !== "text") {
              currentBlock = { type: "text", text: event.delta };
              assistantMessage.content.push(currentBlock);
            } else {
              (currentBlock as TextBlock).text += event.delta;
            }
            flush();
            break;
          }
          case "thinking_delta": {
            if (currentBlock?.type !== "thinking") {
              currentBlock = { type: "thinking", text: event.delta };
              assistantMessage.content.push(currentBlock);
            } else {
              (currentBlock as ThinkingBlockData).text += event.delta;
            }
            flush();
            break;
          }
          case "sources":
            assistantMessage.sources = event.sources;
            flush();
            break;
          case "status":
            assistantMessage.status = event.status;
            flush();
            break;
          case "error":
            toast.error(event.message);
            throw new Error(event.message);
        }
      }

      if (done) break;
    }

    let finalMessage: Message = {
      ...assistantMessage,
      content: assistantMessage.content.map((b) => ({ ...b })),
      sources: assistantMessage.sources
        ? [...assistantMessage.sources]
        : undefined,
      status: "done",
    };
    let finalMessages = [...preceding, finalMessage];
    setMessages(finalMessages);
    return finalMessages;
  }

  return (
    <ScrollToBottomProvider>
      <div className="mx-auto max-w-3xl px-4 pb-[148px]">
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
              model={model}
              onChange={setInput}
              onSubmit={sendMessage}
              onModelChange={handleModelChange}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </ScrollToBottomProvider>
  );
}
