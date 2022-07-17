import AsyncStorage from "@react-native-async-storage/async-storage";
import { authPost } from "../useAuth";

// TODO: send full video for verification
export default async function sendSession(score: number, gameID: string) {
  const sessionToken = await AsyncStorage.getItem("EAGLE_SESSION_TOKEN");
  if (sessionToken)
    await authPost(sessionToken, "/play/private/play", [
      ["id", gameID],
      ["score", score + ""],
    ]);
}
