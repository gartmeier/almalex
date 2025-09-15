import { useState } from "react";
import { useNavigate } from "react-router";
import { MessageInput } from "~/components/message-input";
import { nanoid } from "~/lib/nanoid";

export default function Component() {
  let navigate = useNavigate();
  let [input, setInput] = useState("");
  let [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(message: string) {
    setInput("");
    setIsLoading(true);
    navigate(`/chat/${nanoid()}`, { state: { initialMessage: message } });
  }

  return (
    <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed right-0 bottom-0 left-0 z-10 border-t p-4 backdrop-blur">
      <div className="mx-auto max-w-3xl">
        <MessageInput
          value={input}
          onChange={setInput}
          isLoading={isLoading}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
