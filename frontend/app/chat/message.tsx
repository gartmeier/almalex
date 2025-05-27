import Markdown from "react-markdown";
import type { MessageResponse } from "~/client";

export function Message({ message }: { message: MessageResponse }) {
  if (message.role === "assistant") {
    return (
      <div className="prose inline-block py-5">
        <Markdown>{message.content}</Markdown>
      </div>
    );
  }

  return (
    <div className="flex justify-end py-5">
      <div className="bg-base-200 prose inline-block max-w-[70%] rounded-3xl px-5 py-2.5">
        <Markdown>{message.content}</Markdown>
      </div>
    </div>
  );
}
