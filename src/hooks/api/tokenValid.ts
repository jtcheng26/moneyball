import APP_ENV from "../../../env";

// Check token exists and belongs to address
export default async function tokenValid(token: string, address: string) {
  const form = new FormData();
  form.append("token", token);
  form.append("address", address);
  const tokenValid = await(
    await fetch(APP_ENV.BACKEND_URL + "/auth/valid", {
      method: "post",
      body: form,
    })
  ).json();

  return tokenValid;
}
