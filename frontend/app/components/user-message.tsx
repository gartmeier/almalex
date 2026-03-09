import Markdown from "react-markdown";
import type { Message } from "~/types/messages";

export function UserMessageBlock({ message }: { message: Message }) {
  return (
    <div className="flex justify-end py-5">
      <div className="bg-secondary prose prose-neutral dark:prose-invert inline-block max-w-[70%] rounded-3xl px-5 py-2.5">
        <Markdown>{message.content[0].text}</Markdown>
      </div>
    </div>
  );
}
