import React, { Fragment } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Text,
  AsyncStorage
} from "react-native";
import { AppLoading, Asset, Font, Icon } from "expo";
import Client from "./screens/Client";
import Connect from "./screens/Connect";
import checkServerAddress from "./helpers/checkServerAddress";
import { getClient, clearClient } from "./helpers/graphqlClient";
export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    connection: null,
    client: null
  };
  componentDidMount() {
    this.setConnection();
  }
  setConnection = async () => {
    try {
      const value = await AsyncStorage.getItem("@Thorium:serverAddress");
      if (value !== null) {
        const addressPort = await checkServerAddress(value);
        if (!addressPort) {
          return;
        }
        const { address, port } = addressPort;
        if (address) {
          this.client = getClient(address, port);
          this.setState({ connection: true });
        } else {
          clearClient();
          this.client = null;
          this.setState({ connection: false });
          AsyncStorage.removeItem("@Thorium:serverAddress");
        }
      }
    } catch (error) {
      // Error retrieving data
    }
  };
  render() {
    const { connection } = this.state;
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {connection ? (
            <Fragment>
              {Platform.OS === "ios" && <StatusBar barStyle="default" hidden />}
              <Client client={this.client} />
            </Fragment>
          ) : (
            <Connect connect={this.setConnection} />
          )}
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require("./assets/images/robot-dev.png"),
        require("./assets/images/robot-prod.png")
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf")
      })
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
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
