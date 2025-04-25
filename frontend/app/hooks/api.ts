import { useAuth } from "~/auth/context";
import axios from "axios";

export function useApi() {
  let { accessToken } = useAuth();
  return axios.create({
    baseURL: "/api/",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}