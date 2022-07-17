import useAuth, { authForm, authPost } from "./useAuth";
import { useQuery } from "react-query";
import makeAuthedUseQuery from "./makeUseQuery";

async function getUserTickets(token: string) {
  return (await authPost(token, "/game/private/user/tickets"))[
    "tickets"
  ] as number;
}

export default function useTickets() {
  return makeAuthedUseQuery<number>(["user", "tickets"], getUserTickets, 0);
}
