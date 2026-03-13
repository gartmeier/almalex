import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  async prerender() {
    return [
      "/de",
      "/en",
      "/fr",
      "/de/datenschutz",
      "/de/impressum",
      "/en/privacy",
      "/en/imprint",
      "/fr/protection-des-donnees",
      "/fr/mentions-legales",
    ];
  },
} satisfies Config;
