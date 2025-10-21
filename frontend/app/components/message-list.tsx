import { useEffect, useRef } from "react";
import { useScrollToBottom } from "~/contexts/scroll-to-bottom";
import type { MessageDetail } from "~/lib/api";
import { AssistantMessage } from "./assistant-message";
import { UserMessage } from "./user-message";

export function MessageList({ messages }: { messages: MessageDetail[] }) {
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

  return (
    <>
      {messages.map((message) => {
        if (message.role === "user") {
          return <UserMessage key={message.id} message={message} />;
        } else {
          return <AssistantMessage key={message.id} message={message} />;
        }
      })}
      <div ref={endRef} />
    </>
  );
}
