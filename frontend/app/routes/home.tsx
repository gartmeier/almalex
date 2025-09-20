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
      <div className="fixed inset-0 flex flex-col items-center justify-center px-4 pb-[80px] pt-[64px]">
        <div className="mx-auto w-full max-w-3xl">
          <h1 className="text-center text-4xl font-normal mb-12">
            {t("chat.homeTitle")}
          </h1>

          <div className="flex flex-col gap-2">
            {exampleMessages.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="text-left px-4 py-3 hover:bg-accent/50 hover:rounded-xl transition-all duration-200"
              >
                <p className="text-base text-foreground/70 hover:text-foreground">{example}</p>
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
