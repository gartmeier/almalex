import Markdown from "react-markdown";
import type { MessageResponse } from "~/client";

export function Message({ message }: { message: MessageResponse }) {
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
