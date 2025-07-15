import { useEffect } from "react";
import type { MessageResponse } from "~/lib/api";
import { useScrollToBottom } from "~/contexts/scroll-to-bottom";
import { AssistantMessage } from "./assistant-message";
import { UserMessage } from "./user-message";

type MessageListProps = {
  chatId: string;
  messages: MessageResponse[];
};

export function MessageList({ chatId, messages }: MessageListProps) {
  const { endRef, onViewportEnter, onViewportLeave, scrollToBottom } = useScrollToBottom();

  useEffect(() => {
    if (chatId) {
      scrollToBottom('instant');
    }
  }, [chatId, scrollToBottom]);

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
      </div>
      <div ref={endRef} />
    </div>
  );
}
