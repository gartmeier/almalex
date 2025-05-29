import { useChatContext } from "~/chat/context";
import { Message } from "~/chat/message";

export function Messages() {
  const { messages } = useChatContext();
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-5">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}
