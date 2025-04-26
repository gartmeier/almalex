import { createCookie } from "react-router";
import { createToken } from "./client";

export let tokenCookie = createCookie("token", {
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  secrets: ["secret"],
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 30, // 30 days
});

export async function ensureServerToken(request: Request) {
  let cookieHeader = request.headers.get("Cookie");
  let token = await tokenCookie.parse(cookieHeader);

  if (!token) {
    let { data, error } = await createToken();

    if (error) {
      throw new Error(`Failed to create access token`);
    }

    token = data!.access_token;
  }

  return token;
}
