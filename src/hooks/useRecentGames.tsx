import { useQuery } from "react-query";
import { MatchResults } from "../data/data.types";
import { recentGames } from "../data/saveGame";

export default function useRecentGames(userID: string) {
  return useQuery<MatchResults[]>(
    ["user", "recent", "games", userID],
    async () => (await recentGames(userID)).reverse(),
    {
      refetchInterval: 0,
      enabled: false,
    }
  );
}
