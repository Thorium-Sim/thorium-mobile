const DEV_PORT = 3001;
const PROD_PORT = 1338;

export default async function checkServerAddress(address) {
  const cleanAddress = address
    .replace("https://", "")
    .replace("http://", "")
    .split(":")[0];
  const prodResponse = await fetch(`http://${cleanAddress}:${PROD_PORT}`)
    .then(res => res.text())
    .catch(() => {});
  const devResponse = await fetch(`http://${cleanAddress}:${DEV_PORT}`)
    .then(res => res.text())
    .catch(() => {});
  if (!prodResponse && !devResponse) {
    return false;
  }
  return { address: cleanAddress, port: prodResponse ? PROD_PORT : DEV_PORT };
}
