import { ArrowUp } from "lucide-react";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "./ui/button";

type MessageInputProps = {
  onSubmit: (message: string) => void;
};

export function MessageInput({ onSubmit }: MessageInputProps) {
  let [input, setInput] = useState("");

  let isInputEmpty = input.trim() === "";

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
  }

  function handleSubmit() {
    if (!isInputEmpty) {
      onSubmit(input.trim().replaceAll("\n", " \n"));
      setInput("");
    }
  }

  return (
    <div className="border border-input rounded-2xl bg-muted p-3">
      <TextareaAutosize
        className="w-full resize-none text-base focus:outline-none bg-transparent"
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
          onClick={handleSubmit}
        >
          <ArrowUp />
        </Button>
      </div>
    </div>
  );
}
