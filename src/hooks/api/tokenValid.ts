// Check token exists and belongs to address
export default async function tokenValid(token: string, address: string) {
  const form = new FormData();
  form.append("token", token);
  form.append("address", address);
  const tokenValid = await (
    await fetch("http://192.168.0.104:8080/v1/auth/valid", {
      method: "post",
      body: form,
    })
  ).json();

  return tokenValid;
}
