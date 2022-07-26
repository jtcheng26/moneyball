import AsyncStorage from "@react-native-async-storage/async-storage";
import { authPost } from "../useAuth";

// TODO: send full video for verification
export default async function createCourt(
  latitude: string | number,
  longitude: string | number,
  name: string,
  image: string
) {
  const sessionToken = await AsyncStorage.getItem("EAGLE_SESSION_TOKEN");
  if (sessionToken) {
    if (image.length >= 8 && image.substring(0, 8) === "https://") {
      image = image; // lol
    } else if (image.length === 46 && image.substring(0, 2) === "Qm") {
      image = "https://ipfs.io/ipfs/" + image;
    } else {
      return false;
    }

    return await authPost(sessionToken, "/play/private/kotc/create", [
      ["name", name],
      ["image", image],
      ["latitude", latitude + ""],
      ["longitude", longitude + ""],
    ]);
  } else return false;
}
