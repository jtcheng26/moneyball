import useAuth, { authForm, authPost } from "./useAuth";
import { useQuery } from "react-query";

async function getUserTokens(token: string) {
  return (await authPost(token, "/game/private/user/tokens"))["tokens"];
}

export default function useTokens() {
  const { data: authToken } = useAuth();
  return useQuery(
    ["user", "tokens"],
    async () => {
      return (await getUserTokens(authToken as string)) as number;
    },
    {
      enabled: false,
      // refetchInterval: 2000,
    }
  );
}
