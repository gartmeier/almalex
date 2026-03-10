import { useTranslation } from "react-i18next";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
} from "~/components/ai-elements/prompt-input";
import { models } from "~/lib/models";

type MessageInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  model?: string;
  onModelChange?: (model: string) => void;
};

export function MessageInput({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  disabled = false,
  model,
  onModelChange,
}: MessageInputProps) {
  let { t } = useTranslation();

  function handleSubmit(message: PromptInputMessage) {
    let cleaned = message.text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join("\n");

    if (cleaned) {
      onSubmit(cleaned);
    }
  }

  return (
    <PromptInput onSubmit={handleSubmit}>
      <PromptInputBody>
        <PromptInputTextarea
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t("chat.placeholder")}
          disabled={disabled}
        />
      </PromptInputBody>
      <PromptInputFooter>
        <PromptInputTools>
          {model !== undefined && onModelChange && (
            <PromptInputSelect value={model} onValueChange={onModelChange}>
              <PromptInputSelectTrigger size="sm">
                <PromptInputSelectValue />
              </PromptInputSelectTrigger>
              <PromptInputSelectContent>
                {models.map((m) => (
                  <PromptInputSelectItem key={m.id} value={m.id}>
                    {m.name}
                  </PromptInputSelectItem>
                ))}
              </PromptInputSelectContent>
            </PromptInputSelect>
          )}
        </PromptInputTools>
        <PromptInputSubmit
          disabled={disabled || value.trim() === ""}
          status={isLoading ? "streaming" : undefined}
        />
      </PromptInputFooter>
    </PromptInput>
  );
}
