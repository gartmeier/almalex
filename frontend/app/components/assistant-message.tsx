import Markdown from "react-markdown";
import type { MessageResponse } from "~/lib/api";

type AssistantMessageProps = {
  message: MessageResponse;
};

export function AssistantMessage({ message }: AssistantMessageProps) {
  return (
    <div className="prose inline-block py-5">
      <Markdown>{message.content}</Markdown>
    </div>
  );
}

