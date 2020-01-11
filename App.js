import React, { Fragment } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Button
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import * as Icon from "@expo/vector-icons";
import * as Font from "expo-font";
import Client from "./screens/Client";
import Connect from "./screens/Connect";
import checkServerAddress from "./helpers/checkServerAddress";
import { getClient, clearClient } from "./helpers/graphqlClient";
import ThoriumAddressContext from "./helpers/ThoriumAddressContext";
class ClientGetter extends React.Component {
  state = {
    connection: null
  };
  componentDidMount() {
    this.setConnection();
  }

  setConnection = (addr, prt) => {
    if (addr) {
      return this.createClient(addr, prt);
    }
    this.setState({ loading: true });
    AsyncStorage.getItem("@Thorium:serverAddress")
      .then(value => {
        if (value === null) return;
        return new Promise(resolve => setTimeout(() => resolve(value), 1000));
      })
      .then(value => {
        if (!value) {
          this.setState({ loading: false });
          return;
        }
        checkServerAddress(value)
          .then(addressPort => {
            if (!addressPort) {
              return;
            }
            const { address, port } = addressPort;
            if (address) {
              this.createClient(address, port);
            } else {
              clearClient();
              this.client = null;
              this.setState({ connection: false, loading: false });
              AsyncStorage.removeItem("@Thorium:serverAddress");
            }
          })
          .catch(err => console.log("error", err));
      });
  };
  createClient = async (address, port) => {
    this.client = await getClient(address, port);
    this.setState({ connection: true, loading: false, address, port });
  };
  render() {
    const { connection, loading, address, port } = this.state;
    if (loading)
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black"
          }}
        >
          <Text style={{ color: "white", fontSize: 40 }}>
            Connecting to server...
          </Text>
          <Button
            title="Abort"
            onPress={() => this.setState({ loading: false })}
          />
        </View>
      );
    return (
      <View style={styles.container}>
        {connection ? (
          <Fragment>
            {Platform.OS === "ios" && <StatusBar barStyle="default" hidden />}
            <ThoriumAddressContext.Provider value={{ address, port }}>
              <Client client={this.client} />
            </ThoriumAddressContext.Provider>
          </Fragment>
        ) : (
          <Connect connect={this.setConnection} />
        )}
      </View>
    );
  }
}
export default class App extends React.Component {
  state = {
    isLoadingComplete: false
  };
  render() {
    return <ClientGetter />;
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font
      })
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
    console.log(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111"
  }
});
