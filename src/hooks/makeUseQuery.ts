import { useQuery } from "react-query";
import useAuth from "./useAuth";

export default function makeAuthedUseQuery<T>(
  name: string[],
  func: (authToken: string) => Promise<T>,
  refetchInterval: number = 0,
  manual: boolean = false,
  auto: boolean = false
) {
  const { data: authToken } = useAuth();
  return useQuery(name, async () => (await func(authToken as string)) as T, {
    enabled: manual && auto ? !!authToken : false,
    refetchInterval: refetchInterval,
  });
}
