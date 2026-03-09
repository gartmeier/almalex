import { useEffect, useRef } from "react";
import { useScrollToBottom } from "~/contexts/scroll-to-bottom";
import type { Message } from "~/types/messages";
import { AssistantMessageBlock } from "./assistant-message";
import { UserMessageBlock } from "./user-message";

export function MessageList({
  messages,
  isLoading,
}: {
  messages: Message[];
  isLoading: boolean;
}) {
  let { endRef, onViewportEnter, onViewportLeave } = useScrollToBottom();
  let observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!endRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onViewportEnter();
          } else {
            onViewportLeave();
          }
        });
      },
      { threshold: 0.1 },
    );

    observerRef.current.observe(endRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [onViewportEnter, onViewportLeave]);

  let lastAssistantIndex = -1;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "assistant") {
      lastAssistantIndex = i;
      break;
    }
  }

  return (
    <>
      {messages.map((message, index) => {
        if (message.role === "user") {
          return <UserMessageBlock key={message.id} message={message} />;
        } else {
          return (
            <AssistantMessageBlock
              key={message.id}
              message={message}
              isStreaming={isLoading && index === lastAssistantIndex}
            />
          );
        }
      })}
      <div ref={endRef} />
    </>
  );
}
