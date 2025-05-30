import {
  type RouteConfig,
  index,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  ...prefix("chat", [
    index("chat/chat.tsx", { id: "chatIndex" }),
    route(":chatId", "chat/chat.tsx", { id: "chatDetail" }),
  ]),
] satisfies RouteConfig;
