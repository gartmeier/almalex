import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  layout("routes/_chat.tsx", [
    index("routes/chat.tsx", { id: "chatIndex" }),
    route("chat/:chatId", "routes/chat.tsx", { id: "chatDetail" }),
  ]),
] satisfies RouteConfig;
