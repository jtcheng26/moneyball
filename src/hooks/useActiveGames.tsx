import useAuth, { authForm, authPost } from "./useAuth";
import { useQuery } from "react-query";
import makeAuthedUseQuery from "./makeUseQuery";
import { RawMatch } from "../data/data.types";

async function getActiveGames(token: string) {
  // console.log(token);
  return (await authPost(token, "/play/private/active"))[
    "result"
  ] as RawMatch[];
}

export default function useActiveGames() {
  return makeAuthedUseQuery<RawMatch[]>(
    ["user", "active", "games"],
    getActiveGames,
    0,
    true
  );
}
