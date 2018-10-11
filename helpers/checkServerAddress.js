const DEV_PORT = 3001;
const PROD_PORT = 1338;

export default async function checkServerAddress(address) {
  const cleanAddress = address
    .replace("https://", "")
    .replace("http://", "")
    .split(":")[0];
  const test = await fetch(`http://${cleanAddress}:${PROD_PORT}`)
    .then(() => true)
    .catch(() => false);
  if (test) return { address: cleanAddress, port: PROD_PORT };

  const test2 = await fetch(`http://${cleanAddress}:${DEV_PORT}`)
    .then(() => true)
    .catch(() => false);
  return test2 ? { address: cleanAddress, port: DEV_PORT } : false;
}
