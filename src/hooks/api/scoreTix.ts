import AsyncStorage from "@react-native-async-storage/async-storage";
import { authPost } from "../useAuth";

// TODO: send full video for verification
export default async function scoreTix(score: number) {
  const sessionToken = await AsyncStorage.getItem("EAGLE_SESSION_TOKEN");
  if (sessionToken)
    authPost(sessionToken, "/play/private/kotc/tix", [["score", score + ""]]);
}
