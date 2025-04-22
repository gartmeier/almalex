import { ArrowUp, PenBox } from "lucide-react";
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
