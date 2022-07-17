import makeAuthedUseQuery from "./makeUseQuery";
import { authPost } from "./useAuth";

export async function pollNotifs(token: string) {
  const res = (await authPost(token, "/game/private/user/notifications"))[
    "result"
  ];
  return res;
}

export default function useNotifs() {
  return makeAuthedUseQuery(["user", "notifs"], pollNotifs, 500, true, true);
}
