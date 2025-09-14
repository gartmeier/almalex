import { motion } from "framer-motion";
import { useScrollToBottom } from "~/contexts/scroll-to-bottom";
import type { MessageDetail } from "~/lib/api";
import { AssistantMessage } from "./assistant-message";
import { UserMessage } from "./user-message";

export function MessageList({ messages }: { messages: MessageDetail[] }) {
  const { endRef, onViewportEnter, onViewportLeave, scrollToBottom } =
    useScrollToBottom();

  return (
    <>
      {messages.map((message) => {
        if (message.role === "user") {
          return <UserMessage key={message.id} message={message} />;
        } else {
          return <AssistantMessage key={message.id} message={message} />;
        }
      })}
      <motion.div
        ref={endRef}
        onViewportEnter={onViewportEnter}
        onViewportLeave={onViewportLeave}
      />
    </>
  );
}
