import { LocationCoordinates } from "../data/data.types";
import { justGet } from "./useAuth";

// fixed for the demo so i don't get doxxed :)
export default async function useCurrentLocation() {
  return (await justGet("/game/location")) as LocationCoordinates;
}

export async function switchLocation() {
  await justGet("/game/switch");
  return await useCurrentLocation();
}
