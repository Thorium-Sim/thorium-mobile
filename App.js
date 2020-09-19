import React, { Fragment } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import Client from "./screens/Client";
import Connect from "./screens/Connect";
import checkServerAddress from "./helpers/checkServerAddress";
import { getClient, clearClient } from "./helpers/graphqlClient";
import ThoriumAddressContext from "./helpers/ThoriumAddressContext";

const timeout = (time) =>
  new Promise((resolve) => setTimeout(() => resolve(), time));

const App = () => {
  const [connection, setConnection] = React.useState(null);
  const [address, setAddress] = React.useState(null);
  const [port, setPort] = React.useState(null);
  const [https, setHttps] = React.useState(true);
  const [client, setClient] = React.useState(null);
  const [loading, setLoading] = React.useState(null);

  React.useEffect(() => {
    createConnection();
  }, []);

  const createConnection = async (addr, prt) => {
    if (addr) {
      return createClient(addr, prt);
    }
    setLoading(true);
    const value = await AsyncStorage.getItem("@Thorium:serverAddress");
    const portValue = await AsyncStorage.getItem("@Thorium:serverPort");
    if (!value) {
      setLoading(false);
      return;
    }
    const addressPort = await checkServerAddress(value, portValue, false);
    if (!addressPort) {
      setLoading(false);
      return;
    }
    const { address, port, https } = addressPort;
    if (address) {
      setLoading(false);
      createClient(address, port, https);
    } else {
      clearClient();
      setClient(null);
      setConnection(false);
      setLoading(false);
      AsyncStorage.removeItem("@Thorium:serverAddress");
      AsyncStorage.removeItem("@Thorium:serverPort");
    }
  };
  const createClient = async (address, port, https) => {
    const client = await getClient(address, port, https);
    setClient(client);
    setAddress(address);
    setPort(port);
    setHttps(https);
    setConnection(true);
  };
  if (loading)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        <Text style={{ color: "white", fontSize: 40 }}>
          Connecting to server...
        </Text>
        <Button title="Abort" onPress={() => setLoading(false)} />
      </View>
    );
  return (
    <View style={styles.container}>
      {connection ? (
        <Fragment>
          {Platform.OS === "ios" && <StatusBar barStyle="default" hidden />}
          <ThoriumAddressContext.Provider value={{ address, port, https }}>
            <Client client={client} />
          </ThoriumAddressContext.Provider>
        </Fragment>
      ) : (
        <Connect connect={createConnection} />
      )}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
  },
});
