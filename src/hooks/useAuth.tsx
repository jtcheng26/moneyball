import { useQuery } from "react-query";
import Config from "react-native-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APP_ENV from "../../env";

export function authForm(token: string) {
  const form = new FormData();
  form.append("token", token);

  return form;
}

export async function unauthPost(path: string, data: string[][]) {
  const form = new FormData();
  data.forEach((r) => {
    if (r.length == 2) form.append(r[0], r[1]);
  });

  return await(
    await fetch(APP_ENV.BACKEND_URL + path, {
      method: "post",
      body: form,
    })
  ).json();
}

export async function justGet(path: string) {
  return await(await fetch(APP_ENV.BACKEND_URL + path)).json();
}

export async function authPost(token: string, path: string, data?: string[][]) {
  const form = authForm(token);
  if (data)
    data.forEach((r) => {
      if (r.length == 2) form.append(r[0], r[1]);
    });

  return await(
    await fetch(APP_ENV.BACKEND_URL + path, {
      method: "post",
      body: form,
    })
  ).json();
}

export async function connect(msg: string, addr: string) {
  // console.log("url: ", Config);
  return await unauthPost("/auth/login", [
    ["message", msg],
    ["signer", addr],
  ]);
}

export default function useAuth() {
  return useQuery(["auth"], async () => {
    const sessionToken = await AsyncStorage.getItem("EAGLE_SESSION_TOKEN");
    console.log(sessionToken);
    return sessionToken;
  });
}
