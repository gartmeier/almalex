import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/chat.tsx", { id: "chatIndex" }),
  route("chat/:chatId", "routes/chat.tsx", { id: "chatDetail" }),
] satisfies RouteConfig;
