import type { Message } from "~/types/messages";

export function UserMessageBlock({ message }: { message: Message }) {
  return (
    <div className="flex justify-end py-5">
      <div className="bg-secondary max-w-[70%] rounded-3xl px-5 py-2.5 whitespace-pre-wrap">
        {message.content[0].text}
      </div>
    </div>
  );
}
