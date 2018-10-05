import React, { Component } from "react";
import {
  Alert,
  Platform,
  Image,
  View,
  Text,
  StatusBar,
  TextInput,
  ScrollView,
  StyleSheet,
  Button,
  Switch,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import { WebBrowser } from "expo";
import checkServerAddress from "../helpers/checkServerAddress";

export default class Connect extends Component {
  state = { address: "", saveAddress: true };
  checkAddress = async () => {
    const { address, saveAddress } = this.state;
    const finalAddress = await checkServerAddress(address);
    if (!finalAddress) {
      Alert.alert(
        "Error accessing server",
        "No Thorium server exists at that address."
      );
      return;
    }
    const { address: otherAddress, port } = finalAddress;
    if (saveAddress) {
      try {
        await AsyncStorage.setItem("@Thorium:serverAddress", otherAddress);
      } catch (error) {
        // Error saving data
      }
    }
    this.props.connect(finalAddress);
  };
  handlePressButtonAsync = async () => {
    let result = await WebBrowser.openBrowserAsync("https://thoriumsim.com");
  };
  render() {
    const resizeMode = "cover";
    const { saveAddress } = this.state;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000"
        }}
      >
        {Platform.OS === "ios" && <StatusBar barStyle="light-content" />}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%"
          }}
        >
          <Image
            style={{
              flex: 1,
              resizeMode
            }}
            source={require("../assets/images/background.jpg")}
          />
        </View>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "transparent",
              // justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Image
              style={{ maxHeight: "20%", resizeMode: "contain" }}
              source={require("../assets/images/logo.png")}
            />
            <Text
              style={{
                textAlign: "center",
                fontSize: 40,
                color: "white"
              }}
            >
              Thorium{" "}
            </Text>
            <View>
              <Text style={{ color: "white" }}>
                Enter the Thorium Server address
              </Text>
              <View style={{ flexDirection: "row" }}>
                <TextInput
                  style={{
                    flex: 1,
                    height: 40,
                    borderColor: "gray",
                    borderWidth: 1,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    color: "white",
                    borderRadius: 10
                  }}
                  keyboardType="numeric"
                  value={this.state.address}
                  onChangeText={text => this.setState({ address: text })}
                />
                <Button
                  onPress={this.checkAddress}
                  title="Go"
                  color="#841584"
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                  paddingTop: 20
                }}
              >
                <Switch
                  value={saveAddress}
                  onValueChange={value => this.setState({ saveAddress: value })}
                />
                <Text style={{ color: "white" }}>Save server address</Text>
              </View>
              <TouchableOpacity
                style={{ marginTop: 20 }}
                onPress={this.handlePressButtonAsync}
              >
                <Text style={{ color: "#157EFB", textAlign: "center" }}>
                  Get Thorium Server
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent"
  },
  contentContainer: {
    marginTop: 90
  }
});
