import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("chat/layout.tsx", [
    index("chat/chat.tsx", { id: "chatIndex" }),
    route("chat/:chatId", "chat/chat.tsx", { id: "chatDetail" }),
  ]),
] satisfies RouteConfig;
