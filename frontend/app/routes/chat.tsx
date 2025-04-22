import type { Route } from "./+types/chat";
import { ArrowUp, PenBox } from "lucide-react";

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
      <div className="flex-none flex gap-4">
        <button className="btn btn-primary">Sign In</button>
        <button className="btn">Sign Up</button>
      </div>
    </header>
  );
}

function Panel() {
  return (
    <div className="card mx-auto bg-base-200 shadown-sm border-b-0 max-w-3xl fixed bottom-12 right-0 left-0">
      <div className="card-body p-3">
        <textarea
          className="w-full resize-none focus:outline-none text-lg"
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
