import * as Sentry from "@sentry/react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";

export function ReportIssueButton() {
  let { t } = useTranslation();
  let [feedback, setFeedback] = useState<any>(null);
  let buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFeedback(Sentry.getFeedback());
  }, []);

  useEffect(() => {
    if (feedback && buttonRef.current) {
      let unsubscribe = feedback.attachTo(buttonRef.current);
      return unsubscribe;
    }
  }, [feedback]);

  return (
    <DropdownMenuItem ref={buttonRef}>
      {t("navigation.reportIssue")}
    </DropdownMenuItem>
  );
}
