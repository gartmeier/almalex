import {
  index,
  layout,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),

    // Chat routes
    route("chat/new", "routes/chat/new.tsx"),
    route("chat/:chatId", "routes/chat/chat.tsx"),

    // German routes
    route("de", "routes/de/home.tsx"),
    route("de/faq", "routes/de/faq.tsx"),
    route("de/policies", "routes/de/policies.tsx"),

    // French routes
    route("fr", "routes/fr/home.tsx"),
    route("fr/faq", "routes/fr/faq.tsx"),
    route("fr/policies", "routes/fr/policies.tsx"),

    // English routes
    route("en", "routes/en/home.tsx"),
    route("en/faq", "routes/en/faq.tsx"),
    route("en/policies", "routes/en/policies.tsx"),
  ]),
] satisfies RouteConfig;
