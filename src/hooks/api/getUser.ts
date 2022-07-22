import { useQuery } from "react-query";
import { MatchPlayer, OtherPlayer } from "../../data/data.types";
import { justGet } from "../useAuth";

export async function getUser(id: string) {
  return (await justGet("/game/user/" + id)) as OtherPlayer;
}

export default function useUser(id: string) {
  return useQuery(["user", id], async () => await getUser(id), {
    enabled: false,
  });
}
