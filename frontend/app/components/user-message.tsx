import Markdown from "react-markdown";
import type { MessageResponse } from "~/lib/api";

type UserMessageProps = {
  message: MessageResponse;
};

export function UserMessage({ message }: UserMessageProps) {
  return (
    <div className="flex justify-end py-5">
      <div className="bg-secondary prose prose-neutral dark:prose-invert inline-block max-w-[70%] rounded-3xl px-5 py-2.5">
        <Markdown>{message.content}</Markdown>
      </div>
    </div>
  );
}
