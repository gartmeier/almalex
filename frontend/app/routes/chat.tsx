import { ArrowUp, PenBox, Square } from "lucide-react";
import React, { createContext, useContext, useRef, useState } from "react";
import Markdown from "react-markdown";
import TextareaAutosize from "react-textarea-autosize";
import { nanoid } from "~/utils";
import type { Route } from "./+types/chat";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Alma Lex" },
    { name: "description", content: "Welcome to Alma Lex!" },
  ];
}

type ChatMessage = {
  id: string;
  role: string;
  content: string;
};

type ChatContextType = {
  state: string;
  messages: ChatMessage[];
  sendMessage: (message: string) => void;
  stopResponse: () => void;
};

export default function Chat() {
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

const MESSAGE_LIST = [
  {
    id: nanoid(),
    role: "user",
    content:
      "Hi, I just moved to Zurich — am I allowed to break my rental contract early?",
  },
  {
    id: nanoid(),
    role: "assistant",
    content:
      "Welcome to Zurich! 🇨🇭 Yes, you can end your rental contract early, but there are some rules. Do you know if your contract has a minimum rental period?",
  },
  {
    id: nanoid(),
    role: "user",
    content:
      "Yes, it says I have to stay for at least 12 months. I’ve only been here 4 months.",
  },
  {
    id: nanoid(),
    role: "assistant",
    content:
      "In that case, the usual way out is to find a suitable replacement tenant. If you present a new tenant who is solvent and willing to take over under the same conditions, you can leave early — and legally, the landlord must accept them. Want tips on how to find a replacement tenant?",
  },
  {
    id: nanoid(),
    role: "user",
    content: "Yes please!",
  },
  {
    id: nanoid(),
    role: "assistant",
    content:
      "Great! 🎯 Here are 3 quick tips:  \n1. Post your ad on platforms like Homegate and Ron Orp.  \n2. Make sure the rent price and contract terms are clearly stated.  \n3. Collect an application dossier from the interested party (including salary, ID, and credit report).  \nNeed a free template for a rental application form?",
  },
];

function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<string>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>(MESSAGE_LIST);
  const timeoutRef = useRef<number | null>(null);

  console.log(messages);

  const sendMessage = (message: string) => {
    setMessages([
      ...messages,
      { id: nanoid(), role: "user", content: message },
    ]);
    setState("loading");

    timeoutRef.current = window.setTimeout(() => {
      setState("idle");
    }, 3000);
  };

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

const ChatContext = createContext<ChatContextType | null>(null);

function useChatContext() {
  const context = useContext(ChatContext);
  if (context === null) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
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

  const handleMessageSubmit = () => {
    if (isMessageEmpty) return;

    const normalizedMessage = normalizeMessage(message);
    sendMessage(normalizedMessage);
    setMessage("");
  };

  function handleTextAreaKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (state === "idle" && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleMessageSubmit();
    }
  }

  function handleTextAreaChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessage(event.target.value);
  }

  return (
    <div className="card bg-base-200 shadown-sm mx-auto mb-6 w-full max-w-3xl">
      <div className="card-body flex-row items-start p-3">
        <TextareaAutosize
          className="w-full resize-none focus:outline-none"
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
