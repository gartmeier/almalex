import { Shield } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { MessageInput } from "~/components/message-input";
import { Alert, AlertTitle } from "~/components/ui/alert";
import { getStoredModel, storeModel } from "~/lib/models";
import { nanoid } from "~/lib/nanoid";

// disable SSR
export function clientLoader() {}

export default function Component() {
  let navigate = useNavigate();
  let { t } = useTranslation();
  let { lang } = useParams();
  let prefix = `/${lang ?? "de"}`;
  let [input, setInput] = useState("");
  let [model, setModel] = useState(getStoredModel);

  function handleModelChange(value: string) {
    setModel(value);
    storeModel(value);
  }
  let [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(message: string) {
    setInput("");
    setIsLoading(true);
    navigate(`${prefix}/chat/${nanoid()}`, {
      state: { initialMessage: message },
    });
  }

  function handleExampleClick(example: string) {
    handleSubmit(example);
  }

  let exampleMessages = [
    t("chat.examples.landlord"),
    t("chat.examples.divorce"),
    t("chat.examples.will"),
    t("chat.examples.business"),
    t("chat.examples.insurance"),
    t("chat.examples.employment"),
  ];

  return (
    <>
      <div className="fixed inset-0 flex flex-col px-4 pt-[80px] pb-[80px] sm:items-center sm:justify-center sm:pt-[64px]">
        <div className="mx-auto w-full max-w-3xl">
          <h1 className="text-secondary-foreground mb-6 hidden text-2xl font-semibold sm:mb-12 sm:block sm:text-center sm:text-4xl">
            {t("chat.homeTitle")}
          </h1>

          <div className="hidden flex-col sm:flex">
            {exampleMessages.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="text-foreground/70 hover:text-foreground border-border/60 sm:border-border/60 sm:shadow-card-sm sm:hover:shadow-feature border-b py-4 text-left text-sm transition-all duration-200 last:border-b-0 hover:translate-y-[-1px] sm:rounded-xl sm:border sm:px-4 sm:py-3 sm:text-base"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card/[0.93] fixed right-0 bottom-0 left-0 z-10 border-t p-4 backdrop-blur-md backdrop-saturate-150">
        <div className="mx-auto max-w-3xl">
          <MessageInput
            value={input}
            model={model}
            onChange={setInput}
            onSubmit={handleSubmit}
            onModelChange={handleModelChange}
            isLoading={isLoading}
          />
        </div>
      </div>

      <Alert className="border-border/60 bg-card shadow-card-sm mx-auto mt-4 hidden w-max rounded-[20px] sm:flex">
        <Shield className="text-primary! size-4" />
        <AlertTitle>{t("chat.disclaimer")}</AlertTitle>
      </Alert>
    </>
  );
}
