import { ArrowUp, PenBox, Square } from "lucide-react";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Markdown from "react-markdown";
import { data, redirect, useLoaderData } from "react-router";
import TextareaAutosize from "react-textarea-autosize";
import { ensureServerToken, tokenCookie } from "~/auth.server";
import { type ChatResponse, readChat } from "~/client";
import { client } from "~/client/client.gen";
import { nanoid } from "~/utils";
import type { Route } from "./+types/chat";

export async function loader({ request, params }: Route.LoaderArgs) {
  let token = await ensureServerToken(request);

  client.setConfig({
    baseUrl: "http://localhost:8000/",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  let chat: ChatResponse;

  if (params.chatId) {
    let { data: fetchedChat, response } = await readChat({
      path: { chat_id: params.chatId },
    });

    if (!response.ok) {
      throw redirect("/");
    }

    chat = fetchedChat!;
  } else {
    chat = {
      id: nanoid(),
      title: null,
      messages: [],
    };
  }

  return data(
    { chat, token },
    { headers: { "Set-Cookie": await tokenCookie.serialize(token) } },
  );
}

export function meta({ data: { chat } }: Route.MetaArgs) {
  return [
    { title: chat.title ? `${chat.title} | Alma Lex` : 'Alma Lex' },
    { name: "description", content: "Welcome to Alma Lex!" },
  ];
}

export default function Chat({ loaderData }: Route.ComponentProps) {
  let { chat, token } = loaderData;

  useEffect(() => {
    client.setConfig({
      baseUrl: "/",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }, [token]);

  return (
    <ChatProvider>
      <div className="flex h-screen flex-col">
        <Header />
        <Messages />
        <Panel />
      </div>
    </ChatProvider>
  );
}

type ChatMessage = {
  id: string;
  role: string;
  content: string;
};

type ChatContextType = {
  state: string;
  messages: ChatMessage[];
  sendMessage: (message: string) => Promise<void>;
  stopResponse: () => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

function useChatContext() {
  const context = useContext(ChatContext);
  if (context === null) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}

function ChatProvider({ children }: { children: React.ReactNode }) {
  const { chat, token } = useLoaderData<typeof loader>();

  const [messages, setMessages] = useState<ChatMessage[]>(chat.messages);
  const [state, setState] = useState<string>("idle");
  const timeoutRef = useRef<number | null>(null);

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
    }

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

      for (let serverMessage of chunk.split("\n\n")) {
        let event, data;

        for (let line of serverMessage.split("\n")) {
          if (line.startsWith("event: ")) {
            event = line.slice(7);
          } else if (line.startsWith("data: ")) {
            data = line.slice(6);
          }
        }

        switch (event) {
          case "chat_title":
            document.title = `${data} | Alma Lex`;
            break;
          case "message_delta":
            assistantMessage.content += data;
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
    <ChatContext.Provider
      value={{ state, messages, sendMessage, stopResponse }}
    >
      {children}
    </ChatContext.Provider>
  );
}

function Header() {
  return (
    <header className="navbar">
      <div className="flex-1">
        <button
          className="btn btn-square btn-ghost"
          aria-label="New Chat"
          title="New Chat"
        >
          <PenBox />
        </button>
        <a href="/" className="btn btn-ghost text-xl">
          Alma Lex
        </a>
      </div>
      <div className="flex flex-none gap-4">
        <button className="btn">Sign In</button>
        <button className="btn btn-primary">Sign Up</button>
      </div>
    </header>
  );
}

function Messages() {
  const { messages } = useChatContext();
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}

function Message({ message }: { message: ChatMessage }) {
  if (message.role === "assistant") {
    return (
      <div className="py-5">
        <div className="card">
          <div className="card-body prose inline-block p-0">
            <Markdown>{message.content}</Markdown>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end py-5">
      <div className="card bg-base-200 max-w-[70%] rounded-3xl">
        <div className="card-body prose inline-block px-5 py-2.5">
          <Markdown>{message.content}</Markdown>
        </div>
      </div>
    </div>
  );
}

function normalizeMessage(message: string) {
  return message.trim().replaceAll("\n", "  \n");
}

function Panel() {
  const [message, setMessage] = useState("");
  const { state, sendMessage, stopResponse } = useChatContext();

  const isIdle = state === "idle";
  const isMessageEmpty = message.trim().length === 0;

  async function handleMessageSubmit() {
    if (isMessageEmpty) return;

    setMessage("");

    const normalizedMessage = normalizeMessage(message);
    await sendMessage(normalizedMessage);
  }

  async function handleTextAreaKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (state === "idle" && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      await handleMessageSubmit();
    }
  }

  function handleTextAreaChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessage(event.target.value);
  }

  return (
    <div className="card bg-base-200 shadown-sm mx-auto mb-6 w-full max-w-3xl">
      <div className="card-body flex-row items-start p-3">
        <TextareaAutosize
          className="w-full resize-none text-base focus:outline-none"
          value={message}
          placeholder="How can I help you today?"
          autoFocus
          onKeyDown={handleTextAreaKeyDown}
          onChange={handleTextAreaChange}
        />
        <ActionButton
          isIdle={isIdle}
          isDisabled={isMessageEmpty}
          onSend={handleMessageSubmit}
          onStop={stopResponse}
        />
      </div>
    </div>
  );
}

type ActionButtonProps = {
  isIdle: boolean;
  isDisabled: boolean;
  onSend: () => void;
  onStop: () => void;
};

const ActionButton = ({
  isIdle,
  isDisabled,
  onSend,
  onStop,
}: ActionButtonProps) => {
  const buttonClassName =
    "btn btn-primary btn-square btn-sm h-9 w-9 rounded-lg";

  return isIdle ? (
    <button className={buttonClassName} disabled={isDisabled} onClick={onSend}>
      <ArrowUp />
    </button>
  ) : (
    <button className={buttonClassName} onClick={onStop}>
      <Square fill="currentColor" />
    </button>
  );
};
