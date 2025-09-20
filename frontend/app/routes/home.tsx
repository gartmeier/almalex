import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
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
      <div className="fixed inset-0 flex flex-col px-4 pt-[80px] pb-[80px] sm:items-center sm:justify-center sm:pt-[64px]">
        <div className="mx-auto w-full max-w-3xl">
          <h1 className="mb-6 text-2xl font-normal sm:mb-12 sm:text-center sm:text-4xl">
            {t("chat.homeTitle")}
          </h1>

          <div className="flex flex-col">
            {exampleMessages.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="hover:bg-accent/50 border-border border-b py-4 text-left transition-all duration-200 last:border-b-0 sm:border-0 sm:px-4 sm:py-3 sm:hover:rounded-xl"
              >
                <p className="text-foreground/70 hover:text-foreground text-sm sm:text-base">
                  {example}
                </p>
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
