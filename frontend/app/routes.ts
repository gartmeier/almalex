import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/new/chat.tsx"),

  // German routes
  route("de/faq", "routes/de/faq.tsx"),
  route("de/terms", "routes/de/terms.tsx"),
  route("de/privacy", "routes/de/privacy.tsx"),

  // English routes
  route("en/faq", "routes/en/faq.tsx"),
  route("en/terms", "routes/en/terms.tsx"),
  route("en/privacy", "routes/en/privacy.tsx"),

  // French routes
  route("fr/faq", "routes/fr/faq.tsx"),
  route("fr/terms", "routes/fr/terms.tsx"),
  route("fr/privacy", "routes/fr/privacy.tsx"),
] satisfies RouteConfig;
