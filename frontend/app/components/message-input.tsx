import { ArrowUp, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "./ui/button";
import { cn } from "~/lib/utils";

type MessageInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
};

export function MessageInput({ value, onChange, onSubmit, isLoading = false, disabled = false }: MessageInputProps) {
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
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');
      
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
          "relative flex items-end gap-2 rounded-2xl border bg-muted px-3 py-2 transition-all",
          "shadow-sm hover:shadow-md",
          isFocused && "ring-2 ring-ring ring-offset-2 ring-offset-background",
          isLoading && "opacity-70"
        )}
      >
        <TextareaAutosize
          ref={textareaRef}
          className="flex-1 resize-none bg-transparent text-base leading-6 py-1 focus:outline-none placeholder:text-muted-foreground/70"
          value={value}
          placeholder={t("chat.placeholder")}
          aria-label={t("chat.placeholder")}
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
          aria-label={isLoading ? t("chat.sending") : t("chat.sendMessage")}
          className={cn(
            "h-8 w-8 shrink-0 transition-all self-end",
            !isInputEmpty && "hover:scale-105"
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