import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  async prerender() {
    return [
      "/de",
      "/en",
      "/fr",
      "/de/datenschutz",
      "/de/nutzungsbedingungen",
      "/en/privacy",
      "/en/terms",
      "/fr/protection-des-donnees",
      "/fr/conditions-utilisation",
    ];
  },
} satisfies Config;
