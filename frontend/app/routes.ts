import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  ...prefix("chat", [
    layout("chat/layout.tsx", [
      index("chat/chat.tsx", { id: "chatIndex" }),
      route(":chatId", "chat/chat.tsx", { id: "chatDetail" }),
    ]),
  ]),
] satisfies RouteConfig;
