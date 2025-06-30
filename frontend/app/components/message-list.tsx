import type { MessageResponse } from "~/lib/api";
import { AssistantMessage } from "./assistant-message";
import { UserMessage } from "./user-message";

type MessageListProps = {
  messages: MessageResponse[];
};

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="mx-auto max-w-3xl">
      {messages.map((message) => {
        if (message.role === "user") {
          return <UserMessage key={message.id} message={message} />;
        } else {
          return <AssistantMessage key={message.id} message={message} />;
        }
      })}
    </div>
  );
}
