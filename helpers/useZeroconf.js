import React from "react";
import Zeroconf from "react-native-zeroconf";
const zeroconf = new Zeroconf();

const useZeroconf = () => {
  React.useEffect(() => {
    function processResolved(a, b, c) {
      console.log(a, b, c);
    }
    zeroconf.scan();
    setInterval(() => console.log(zeroconf.getServices()), 1000);
    // console.log(zeroconf.getServices());
    zeroconf.on("resolved", processResolved);
    zeroconf.on("found", console.log);
    zeroconf.on("error", (a, b, c, d) => {
      console.log(a, b, c, d);
    });
    return () => {
      zeroconf.removeListener("resolved", processResolved);
      zeroconf.stop();
    };
  }, []);
};

export default useZeroconf;
