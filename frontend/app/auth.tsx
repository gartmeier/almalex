import React, { createContext, useContext, useEffect, useState } from "react";
import { client } from "~/client/client.gen";
import { createToken } from "./client";

type AuthContextType = {
  accessToken: string | null;
};

let AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  let [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let storedToken = localStorage.getItem("access_token");
      if (storedToken) {
        return setAccessToken(storedToken);
      }

      let {data, error} = await createToken()

      if (error) {
        throw new Error(`Failed to create access token`);
      }

      let token = data!.access_token;

      if (token) {
        localStorage.setItem("access_token", token);
        setAccessToken(token);
      }

      throw new Error("No access token received");
    })();
  }, []);

  useEffect(() => {
    client.setConfig({
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  }, [accessToken]);

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
