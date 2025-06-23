import { ArrowUp, Square } from "lucide-react";
import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useChatContext } from "~/components/chat/context";
import { useRateLimit } from "~/lib/hooks/use-rate-limit";

export function Panel() {
  const [message, setMessage] = useState("");
  const { state, sendMessage, stopResponse } = useChatContext();
  const { data: rateLimit } = useRateLimit();

  const isIdle = state === "idle";
  const isMessageEmpty = message.trim().length === 0;
  const isRateLimited = rateLimit?.remaining === 0;

  async function handleMessageSubmit() {
    if (isMessageEmpty || isRateLimited) return;

    setMessage("");

    const normalizedMessage = normalizeMessage(message);
    await sendMessage(normalizedMessage);
  }

  function normalizeMessage(message: string) {
    return message.trim().replaceAll("\n", "  \n");
  }

  async function handleTextAreaKeyDown(event: React.KeyboardEvent) {
    if (
      state === "idle" &&
      event.key === "Enter" &&
      !event.shiftKey &&
      !isRateLimited
    ) {
      event.preventDefault();
      await handleMessageSubmit();
    }
  }

  function handleTextAreaChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessage(event.target.value);
  }

  return (
    <div className="card bg-base-200 shadown-sm mx-auto mb-6 w-full max-w-3xl">
      <div className="card-body flex-row items-start p-3">
        <TextareaAutosize
          className="w-full resize-none text-base focus:outline-none"
          value={message}
          placeholder="How can I help you today?"
          autoFocus
          onKeyDown={handleTextAreaKeyDown}
          onChange={handleTextAreaChange}
        />
        <ActionButton
          isIdle={isIdle}
          isDisabled={isMessageEmpty || isRateLimited}
          onSend={handleMessageSubmit}
          onStop={stopResponse}
        />
      </div>
    </div>
  );
}

type ActionButtonProps = {
  isIdle: boolean;
  isDisabled: boolean;
  onSend: () => void;
  onStop: () => void;
};

const ActionButton = ({
  isIdle,
  isDisabled,
  onSend,
  onStop,
}: ActionButtonProps) => {
  const buttonClassName =
    "btn btn-primary btn-square btn-sm h-9 w-9 rounded-lg";

  return isIdle ? (
    <button className={buttonClassName} disabled={isDisabled} onClick={onSend}>
      <ArrowUp />
    </button>
  ) : (
    <button className={buttonClassName} onClick={onStop}>
      <Square fill="currentColor" />
    </button>
  );
};
