import { Loader2, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

export function StatusIndicator({
  status,
}: {
  status: "searching" | "thinking" | "generating" | "done";
}) {
  let { t } = useTranslation();

  if (status === "done" || status === "generating") return null;

  return (
    <div className="text-muted-foreground mb-2.5 flex animate-pulse items-center gap-2 text-sm">
      {status === "searching" && <Search size={16} />}
      {status === "thinking" && <Loader2 size={16} className="animate-spin" />}
      <span>
        {status === "searching" ? t("chat.searching") : t("chat.thinking")}
      </span>
    </div>
  );
}
