import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  async prerender() {
    return [
      "/de",
      "/en",
      "/fr",
      "/de/policies",
      "/en/policies",
      "/fr/policies",
    ];
  },
} satisfies Config;
