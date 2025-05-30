import Markdown from "react-markdown";
import { useChatContext } from "~/chat/context";
import type { MessageResponse } from "~/lib/api";

export function Messages() {
  const { messages } = useChatContext();
  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{ scrollbarGutter: "stable both-edges" }}
    >
      <div className="mx-auto max-w-3xl px-3">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}

function Message({ message }: { message: MessageResponse }) {
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
