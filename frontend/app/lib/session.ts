import { createCookieSessionStorage } from "react-router";

type SessionData = {
  language: string;
  theme: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__session",
    },
  });

export { commitSession, destroySession, getSession };
