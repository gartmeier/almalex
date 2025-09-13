import type { MessageDetail } from "~/lib/api";
import { AssistantMessage } from "./assistant-message";
import { UserMessage } from "./user-message";

export function MessageList({ messages }: { messages: MessageDetail[] }) {
  return (
    <>
      {messages.map((message) => {
        if (message.role === "user") {
          return <UserMessage key={message.id} message={message} />;
        } else {
          return <AssistantMessage key={message.id} message={message} />;
        }
      })}
    </>
  );
}
