import useAuth, { authForm, authPost } from "./useAuth";
import { useQuery } from "react-query";
import makeAuthedUseQuery from "./makeUseQuery";

async function getUserTrophies(token: string) {
  return (await authPost(token, "/game/private/user/trophies"))["trophies"];
}

export default function useTrophies() {
  return makeAuthedUseQuery<number>(["user", "trophies"], getUserTrophies, 0);
}
