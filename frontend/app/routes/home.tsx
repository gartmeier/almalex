import * as Sentry from "@sentry/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { MessageInput } from "~/components/message-input";
import { createChat } from "~/lib/api";

export default function Component() {
  let navigate = useNavigate();
  let [input, setInput] = useState("");

  async function handleSubmit(message: string) {
    try {
      let response = await createChat({
        body: {
          message: message,
        },
        throwOnError: true,
      });

      setInput("");
      navigate(`/chat/${response.data.id}`);
    } catch (error) {
      toast.error("Failed to create chat. Please try again.");
      Sentry.captureException(error);
    }
  }

  return (
    <div className="fixed right-0 bottom-0 left-0 z-10 p-4">
      <div className="mx-auto max-w-3xl">
        <MessageInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
