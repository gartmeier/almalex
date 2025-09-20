import { useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { MessageInput } from "~/components/message-input";
import { nanoid } from "~/lib/nanoid";

export default function Component() {
  let navigate = useNavigate();
  let { t } = useTranslation();
  let [input, setInput] = useState("");
  let [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(message: string) {
    setInput("");
    setIsLoading(true);
    navigate(`/chat/${nanoid()}`, { state: { initialMessage: message } });
  }

  function handleExampleClick(example: string) {
    handleSubmit(example);
  }

  let exampleMessages = [
    t("chat.examples.landlord"),
    t("chat.examples.divorce"),
    t("chat.examples.will"),
    t("chat.examples.business"),
    t("chat.examples.flight"),
    t("chat.examples.employment"),
  ];

  return (
    <>
      <div className="fixed inset-0 flex flex-col px-4 pb-[80px] pt-[80px] sm:pt-[64px] sm:items-center sm:justify-center">
        <div className="mx-auto w-full max-w-3xl">
          <h1 className="text-2xl sm:text-4xl font-normal mb-6 sm:mb-12 sm:text-center">
            {t("chat.homeTitle")}
          </h1>

          <div className="flex flex-col">
            {exampleMessages.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="text-left py-4 sm:py-3 sm:px-4 hover:bg-accent/50 sm:hover:rounded-xl transition-all duration-200 border-b border-border last:border-b-0 sm:border-0"
              >
                <p className="text-sm sm:text-base text-foreground/70 hover:text-foreground">{example}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

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
    </>
  );
}
