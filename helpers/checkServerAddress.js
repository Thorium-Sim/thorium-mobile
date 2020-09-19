const DEV_PORT = 3001;
const PROD_PORT = 4444;

export default async function checkServerAddress(address, port) {
  const https = false;
  console.log(`${https ? "https" : "http"}://${address}:${port}`);
  const test = await fetch(`${https ? "https" : "http"}://${address}:${port}`)
    .then(() => true)
    .catch((err) => {
      console.log(err.message);
      return false;
    });
  if (test) return { address: address, port: port, https };

  const test2 = await fetch(`${https ? "http" : "https"}://${address}:${port}`)
    .then(() => true)
    .catch(() => false);
  return test2 ? { address: address, port: port, https: !https } : false;
}
