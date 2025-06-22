import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("chat/chat.tsx", { id: "home" }),
  route("chat/:chatId", "chat/chat.tsx"),
] satisfies RouteConfig;
