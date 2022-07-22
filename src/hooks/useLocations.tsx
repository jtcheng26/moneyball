import useAuth, { authForm, authPost } from "./useAuth";
import { useQuery } from "react-query";
import makeAuthedUseQuery from "./makeUseQuery";
import { CourtLocation, RawMatch } from "../data/data.types";

async function getLocations(token: string) {
  // console.log(token);
  const courts = (await authPost(token, "/play/private/kotc/locations"))[
    "result"
  ] as CourtLocation[];
  return courts.map((c) => {
    c.coordinates.latitude = c.coordinates.latitude / 100000 - 180;
    c.coordinates.longitude = c.coordinates.longitude / 100000 - 180;

    return c;
  });
}

export default function useLocations() {
  return makeAuthedUseQuery<CourtLocation[]>(
    ["user", "locations"],
    getLocations,
    0,
    true,
    true
  );
}
