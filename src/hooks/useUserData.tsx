import { useQuery } from "react-query";
import Config from "react-native-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuth, { authForm, authPost } from "./useAuth";
import { User } from "../data/data.types";
import useTickets from "./useTickets";
import useTokens from "./useTokens";
import useTrophies from "./useTrophies";

async function getUserData(token: string) {
  return await authPost(token, "/game/private/user");
}

export default function useUserData() {
  const { data: authToken, isSuccess: authSuccess } = useAuth();
  const { data: tickets, isSuccess: tixSuccess } = useTickets();
  const { data: tokens, isSuccess: tokenSuccess } = useTokens();
  const { data: trophies, isSuccess: trophySuccess } = useTrophies();

  return useQuery(
    ["user", "data"],
    async () => {
      const user = await getUserData(authToken as string);
      const ret = {
        id: user["id"],
        address: user["id"],
        name: user["name"],
        tokens: tokens,
        tickets: tickets,
        icon: "Basketball",
        trophies: trophies,
      } as User;

      return ret;
    },
    {
      enabled: false,
      // refetchOnWindowFocus: "always",
      // refetchOnReconnect: "always",
      refetchInterval: 0,
    }
  );
}
