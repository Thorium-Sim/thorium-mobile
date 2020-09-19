import React from "react";
import Zeroconf from "react-native-zeroconf";
const zeroconf = new Zeroconf();

const useZeroconf = () => {
  const [servers, setServers] = React.useState([]);
  React.useEffect(() => {
    function processResolved(service) {
      if (service.name.includes("Thorium")) {
        const isHttps = service.txt.https === "true";
        const ipregex = /[0-2]?[0-9]{1,2}\.[0-2]?[0-9]{1,2}\.[0-2]?[0-9]{1,2}\.[0-2]?[0-9]{1,2}/gi;
        const address = service.addresses.find((a) => ipregex.test(a));

        setServers((s) =>
          s
            .filter((s) => s.name !== service.host)
            .concat({
              name: service.host,
              address,
              port: service.port,
              https: isHttps,
            })
        );
      }
    }
    zeroconf.scan();
    zeroconf.on("resolved", processResolved);
    return () => {
      zeroconf.removeListener("resolved", processResolved);
      zeroconf.stop();
    };
  }, []);
  return servers;
};

export default useZeroconf;
