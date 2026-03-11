import { ArrowUp, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import TextareaAutosize from "react-textarea-autosize";
import { models } from "~/lib/models";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type MessageInputProps = {
  value: string;
  model: string;
  onChange: (value: string) => void;
  onSubmit: (message: string) => void;
  onModelChange: (model: string) => void;
  isLoading?: boolean;
};

export function MessageInput({
  value,
  model,
  onChange,
  onSubmit,
  onModelChange,
  isLoading = false,
}: MessageInputProps) {
  let { t } = useTranslation();
  let [isFocused, setIsFocused] = useState(false);
  let textareaRef = useRef<HTMLTextAreaElement>(null);

  let isInputEmpty = value.trim() === "";
  let isDisabled = isLoading || isInputEmpty;

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
          "border-input bg-input/30 relative flex flex-col rounded-2xl border px-3 py-2 transition-all",
          "shadow-sm hover:shadow-md",
          isFocused && "ring-ring ring-offset-background ring-2 ring-offset-2",
          isLoading && "opacity-70",
        )}
      >
        <TextareaAutosize
          ref={textareaRef}
          className="placeholder:text-muted-foreground/70 selection:bg-primary selection:text-primary-foreground w-full resize-none bg-transparent py-1 text-base leading-6 focus:outline-none"
          value={value}
          placeholder={t("chat.placeholder")}
          autoFocus
          disabled={isLoading}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxRows={8}
          minRows={2}
        />
        <div className="flex items-center justify-between pt-1">
          <Select value={model} onValueChange={onModelChange}>
            <SelectTrigger className="h-8 w-auto gap-1 border-none bg-transparent px-2 text-xs shadow-none dark:bg-transparent dark:hover:bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" side="top" align="start">
              {models.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="icon"
            type="submit"
            disabled={isDisabled}
            className={cn(
              "h-8 w-8 shrink-0 transition-all",
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
      </div>
    </form>
  );
}
