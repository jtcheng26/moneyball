import { LocationCoordinates } from "../data/data.types";

// fixed for the demo so i don't get doxxed :)
export default function useCurrentLocation(): LocationCoordinates {
  return {
    latitude: 34.074, // hitch
    longitude: -118.4539, // hitch
    // latitude: 34.0695, // ostin
    // longitude: -118.448, // ostin
  };
}
