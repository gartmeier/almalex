import { useChatContext } from "~/chat/context";
import { Message } from "~/chat/message";

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
