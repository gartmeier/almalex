import { ArrowUp, PenBox } from "lucide-react";
import Markdown from "react-markdown";
import type { Route } from "./+types/chat";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Alma Lex" },
    { name: "description", content: "Welcome to Alma Lex!" },
  ];
}

export default function Chat() {
  return (
    <>
      <Header />
      <Messages />
      <Panel />
    </>
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
        <button className="btn btn-primary">Sign In</button>
        <button className="btn">Sign Up</button>
      </div>
    </header>
  );
}

const MESSAGE_LIST = [
  {
    id: 1,
    role: "user",
    content:
      "Hi, I just moved to Zurich — am I allowed to break my rental contract early?",
  },
  {
    id: 2,
    role: "assistant",
    content:
      "Welcome to Zurich! 🇨🇭 Yes, you can end your rental contract early, but there are some rules. Do you know if your contract has a minimum rental period?",
  },
  {
    id: 3,
    role: "user",
    content:
      "Yes, it says I have to stay for at least 12 months. I’ve only been here 4 months.",
  },
  {
    id: 4,
    role: "assistant",
    content:
      "In that case, the usual way out is to find a suitable replacement tenant. If you present a new tenant who is solvent and willing to take over under the same conditions, you can leave early — and legally, the landlord must accept them. Want tips on how to find a replacement tenant?",
  },
  {
    id: 5,
    role: "user",
    content: "Yes please!",
  },
  {
    id: 6,
    role: "assistant",
    content:
      "Great! 🎯 Here are 3 quick tips:  \n1. Post your ad on platforms like Homegate and Ron Orp.  \n2. Make sure the rent price and contract terms are clearly stated.  \n3. Collect an application dossier from the interested party (including salary, ID, and credit report).  \nNeed a free template for a rental application form?",
  },
];

function Messages() {
  return (
    <div className="mx-auto max-w-3xl">
      {MESSAGE_LIST.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
}

function Message({
  message,
}: {
  message: { id: number; role: string; content: string };
}) {
  if (message.role === "assistant") {
    return (
      <div className="card">
        <div className="card-body prose px-0">
          <Markdown>{message.content}</Markdown>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <div className="card bg-base-200 shadown-sm w-[70%]">
        <div className="card-body prose">
          <Markdown>{message.content}</Markdown>
        </div>
      </div>
    </div>
  );
}

function Panel() {
  return (
    <div className="card bg-base-200 shadown-sm fixed right-0 bottom-12 left-0 mx-auto max-w-3xl border-b-0">
      <div className="card-body p-3">
        <textarea
          className="w-full resize-none text-lg focus:outline-none"
          placeholder="Ask anything"
          autoFocus
          rows={2}
        ></textarea>
        <div className="card-actions justify-end">
          <button className="btn btn-primary btn-circle">
            <ArrowUp size={20} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}
