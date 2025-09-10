import {
  index,
  layout,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),

    // Chat route
    route("c/:chatId", "routes/chat.tsx"),

    // German routes
    route("de/faq", "routes/de/faq.tsx"),
    route("de/policies", "routes/de/policies.tsx"),

    // English routes
    route("en/faq", "routes/en/faq.tsx"),
    route("en/policies", "routes/en/policies.tsx"),

    // French routes
    route("fr/faq", "routes/fr/faq.tsx"),
    route("fr/policies", "routes/fr/policies.tsx"),
  ]),
] satisfies RouteConfig;
