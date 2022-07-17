import AsyncStorage from "@react-native-async-storage/async-storage";
import { GameCode } from "../../data/data.types";
import { authPost } from "../useAuth";

// TODO: send full video for verification
export default async function startMatching(
  mode: GameCode,
  ticketCost: number
) {
  const sessionToken = await AsyncStorage.getItem("EAGLE_SESSION_TOKEN");
  if (sessionToken)
    await authPost(sessionToken, "/play/private/match", [
      ["mode_id", mode],
      ["ticket_cost", ticketCost + ""],
    ]);
}
