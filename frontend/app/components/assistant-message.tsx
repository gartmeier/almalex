import Markdown from "react-markdown";
import type { MessageDetail } from "~/lib/api";

type AssistantMessageProps = {
  message: MessageDetail;
};

export function AssistantMessage({ message }: AssistantMessageProps) {
  return (
    <div className="prose prose-neutral dark:prose-invert inline-block max-w-none py-5">
      <Markdown>{message.content}</Markdown>
    </div>
  );
}
