import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { getRateLimit } from "~/lib/api";

export function RateLimitAlert({ isRateLimited = false }: { isRateLimited?: boolean }) {
  const [isVisible, setIsVisible] = useState(true);

  const { data: rateLimit } = useQuery({
    queryKey: ["rateLimit"],
    queryFn: async () => {
      let { data, error } = await getRateLimit();
      if (error) {
        throw new Error("Failed to fetch rate limit data");
      }
      return data;
    },
  });

  useEffect(() => {
    if (rateLimit || isRateLimited) {
      setIsVisible(true);
    }
  }, [rateLimit, isRateLimited]);

  if (!isVisible) return null;

  if (isRateLimited || (rateLimit && rateLimit.remaining === 0)) {
    return (
      <div className="blur-fallback:bg-secondary relative mx-auto my-4 w-fit rounded-xl border border-red-400/20 bg-red-300/50 px-5 py-3 pr-12 text-red-800 shadow-lg backdrop-blur-md dark:border-red-800/20 dark:bg-red-800/30 dark:text-red-100/90">
        Rate limit exceeded. You have used all your messages for this week.
        <X
          size={18}
          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
          onClick={() => setIsVisible(false)}
        />
      </div>
    );
  }

  if (!rateLimit || !rateLimit.used) return null;

  return (
    <div className="blur-fallback:bg-secondary relative mx-auto my-4 w-fit rounded-xl border border-yellow-400/20 bg-yellow-300/50 px-5 py-3 pr-12 text-yellow-800 shadow-lg backdrop-blur-md dark:border-yellow-800/20 dark:bg-yellow-800/30 dark:text-yellow-100/90">
      You only have {rateLimit.remaining} messages left.
      <X
        size={18}
        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
        onClick={() => setIsVisible(false)}
      />
    </div>
  );
}
