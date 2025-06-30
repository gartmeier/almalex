import { ArrowUp } from "lucide-react";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "./ui/button";

type MessageInputProps = {
  sendMessage: (message: string) => void;
};

export function MessageInput({ sendMessage }: MessageInputProps) {
  let [input, setInput] = useState("");

  let isInputEmpty = input.trim() === "";

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submitForm();
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
  }

  function submitForm() {
    if (!isInputEmpty) {
      sendMessage(input.trim().replaceAll("\n", " \n"));
      setInput("");
    }
  }

  return (
    <div className="absolute bottom-0 w-full">
      <div className="bg-secondary mx-auto max-w-3xl rounded-t-xl p-3">
        <TextareaAutosize
          className="w-full resize-none text-base focus:outline-none"
          value={input}
          placeholder="How can I help you today?"
          autoFocus
          onKeyDown={handleKeyDown}
          onChange={handleChange}
        />
        <div className="mt-2 flex justify-end">
          <Button
            size="icon"
            type="button"
            disabled={isInputEmpty}
            onClick={submitForm}
          >
            <ArrowUp />
          </Button>
        </div>
      </div>
    </div>
  );
}
