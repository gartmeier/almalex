import { useQueryClient } from "@tanstack/react-query";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ChatDetail, MessageResponse } from "~/lib/api";
import { nanoid } from "~/lib/utils/nanoid";
import { parseServerSentEvents } from "~/lib/utils/sse";

type ChatContextType = {
  state: string;
  messages: MessageResponse[];
  sendMessage: (message: string) => Promise<void>;
  stopResponse: () => void;
};

const Context = createContext<ChatContextType | null>(null);

export function useChatContext() {
  const context = useContext(Context);
  if (context === null) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}

export function ChatProvider({
  chat,
  token,
  children,
}: {
  chat: ChatDetail;
  token: string;
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<MessageResponse[]>(chat.messages);
  const [state, setState] = useState<string>("idle");
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setMessages(chat.messages);
  }, [chat.messages]);

  async function sendMessage(content: string) {
    if (window.location.pathname !== `/chat/${chat.id}`) {
      window.history.pushState(null, "", `/chat/${chat.id}`);
    }

    let userMessage = {
      id: nanoid(),
      role: "user",
      content,
    };
    let assistantMessage = {
      id: nanoid(),
      role: "assistant",
      content: "",
      state: "streaming",
    };

    setMessages([...messages, userMessage, assistantMessage]);
    setState("streaming");

    let response = await fetch(`/api/chats/${chat.id}/messages`, {
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
            queryClient.invalidateQueries({ queryKey: ["chats"] });
            break;
          case "message_id":
            assistantMessage.id = event.data;
            setMessages([...messages, userMessage, assistantMessage]);
            queryClient.invalidateQueries({ queryKey: ["chats"] });
            break;
          case "message_delta":
            assistantMessage.content += event.data;
            setMessages([...messages, userMessage, assistantMessage]);
            break;
        }
      }
    }

    assistantMessage.state = "idle";
    setMessages([...messages, userMessage, assistantMessage]);

    setState("idle");
  }

  const stopResponse = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      setState("idle");
    }
  };

  return (
    <Context.Provider value={{ state, messages, sendMessage, stopResponse }}>
      {children}
    </Context.Provider>
  );
}
