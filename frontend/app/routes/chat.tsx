import type { Route } from "./+types/home";
import { PenBox } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Alma Lex" },
    { name: "description", content: "Welcome to Alma Lex!" },
  ];
}

export default function Chat() {
  return (
    <div className="navbar">
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
    </div>
  );
}
