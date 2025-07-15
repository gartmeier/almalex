import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("chat/new", "routes/chat.tsx", { id: "chat-new" }),
  route("chat/:chatId", "routes/chat.tsx"),
] satisfies RouteConfig;
