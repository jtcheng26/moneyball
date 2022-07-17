import AsyncStorage from "@react-native-async-storage/async-storage";
import { authPost } from "../useAuth";

// TODO: send full video for verification
export default async function createUser(name: string, icon: string) {
  const sessionToken = await AsyncStorage.getItem("EAGLE_SESSION_TOKEN");
  if (sessionToken)
    return await authPost(sessionToken, "/game/private/user/create", [
      ["name", name],
      ["icon", icon],
    ]);
  else return false;
}
