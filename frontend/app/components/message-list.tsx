import { motion } from "framer-motion";
import type { MessageResponse } from "~/lib/api";
import { useScrollToBottom } from "~/contexts/scroll-to-bottom";
import { AssistantMessage } from "./assistant-message";
import { UserMessage } from "./user-message";

type MessageListProps = {
  messages: MessageResponse[];
};

export function MessageList({ messages }: MessageListProps) {
  const { onViewportEnter, onViewportLeave } = useScrollToBottom();

  return (
    <div
      className="h-screen w-full overflow-y-auto pb-[120px]"
      style={{ scrollbarGutter: "stable both-edges" }}
    >
      <div className="mx-auto max-w-3xl">
        {messages.map((message) => {
          if (message.role === "user") {
            return <UserMessage key={message.id} message={message} />;
          } else {
            return <AssistantMessage key={message.id} message={message} />;
          }
        })}
        <motion.div
          onViewportEnter={onViewportEnter}
          onViewportLeave={onViewportLeave}
        />
      </div>
    </div>
  );
}
