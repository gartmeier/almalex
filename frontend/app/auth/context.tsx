import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  accessToken: string | null;
};

let AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  let [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let storedToken = localStorage.getItem("access_token");
      if (storedToken) {
        return setAccessToken(storedToken);
      }

      let res = await fetch("/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`Failed to get token: ${res.status}`);
      }

      let data = await res.json();
      let token = data.access_token;

      if (token) {
        localStorage.setItem("access_token", token);
        setAccessToken(token);
      }

      throw new Error("No access token received");
    })();
  }, []);

  if (!accessToken) {
    return null;
  }

  return <AuthContext value={{ accessToken }}>{children}</AuthContext>;
}

export function useAuth() {
  let context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}
