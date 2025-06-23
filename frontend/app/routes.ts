import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/chat.tsx", { id: "home" }),
  route("chat/:chatId", "routes/chat.tsx"),
] satisfies RouteConfig;
