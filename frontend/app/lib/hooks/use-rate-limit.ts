import { useQuery } from "@tanstack/react-query";
import { getRateLimit } from "~/lib/api";

export function useRateLimit() {
  return useQuery({
    queryKey: ["rateLimit"],
    queryFn: async () => {
      const { data } = await getRateLimit();
      return data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 25000, // Consider data stale after 25 seconds
  });
}