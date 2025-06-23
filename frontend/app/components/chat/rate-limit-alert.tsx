import { AlertTriangle, Ban } from "lucide-react";
import { useRateLimit } from "~/lib/hooks/use-rate-limit";

export function RateLimitAlert() {
  const { data: rateLimit, isLoading } = useRateLimit();

  if (isLoading || !rateLimit) {
    return null;
  }

  const { remaining, used, max } = rateLimit;

  // Don't show alert if no messages have been used
  if (used === 0) {
    return null;
  }

  // Red alert when no messages remaining
  if (remaining === 0) {
    return (
      <div className="mx-auto max-w-3xl px-3 pb-3">
        <div className="alert alert-error">
          <Ban className="h-6 w-6" />
          <span>
            You have reached your message limit ({max} messages). Please wait
            before sending more messages.
          </span>
        </div>
      </div>
    );
  }

  // Yellow alert when at least 1 message used and messages remaining
  return (
    <div className="mx-auto max-w-3xl px-3 pb-3">
      <div className="alert alert-warning">
        <AlertTriangle className="h-6 w-6" />
        <span>
          {remaining} of {max} messages remaining this week.
        </span>
      </div>
    </div>
  );
}
