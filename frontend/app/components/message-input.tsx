import { ArrowUp, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";

type MessageInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
};

export function MessageInput({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  disabled = false,
}: MessageInputProps) {
  let { t } = useTranslation();
  let [isFocused, setIsFocused] = useState(false);
  let textareaRef = useRef<HTMLTextAreaElement>(null);

  let isInputEmpty = value.trim() === "";
  let isDisabled = disabled || isLoading || isInputEmpty;

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.target.value);
  }

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!isDisabled) {
      // Preserve intentional line breaks but clean up extra whitespace
      let cleanedMessage = value
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .join("\n");

      if (cleanedMessage) {
        onSubmit(cleanedMessage);
        textareaRef.current?.focus();
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div
        className={cn(
          "bg-muted relative flex items-end gap-2 rounded-2xl border px-3 py-2 transition-all",
          "shadow-sm hover:shadow-md",
          isFocused && "ring-ring ring-offset-background ring-2 ring-offset-2",
          isLoading && "opacity-70",
        )}
      >
        <TextareaAutosize
          ref={textareaRef}
          className="placeholder:text-muted-foreground/70 flex-1 resize-none bg-transparent py-1 text-base leading-6 focus:outline-none"
          value={value}
          placeholder={t("chat.placeholder")}
          autoFocus
          disabled={disabled || isLoading}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxRows={8}
          minRows={1}
        />
        <Button
          size="icon"
          type="submit"
          disabled={isDisabled}
          className={cn(
            "h-8 w-8 shrink-0 self-end transition-all",
            !isInputEmpty && "hover:scale-105",
          )}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowUp className="h-4 w-4" />
          )}
        </Button>
      </div>
    </form>
  );
}
