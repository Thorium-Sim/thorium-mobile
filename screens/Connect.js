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
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import useZeroconf from "../helpers/useZeroconf";

import * as WebBrowser from "expo-web-browser";
import checkServerAddress from "../helpers/checkServerAddress";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    padding: 20,
  },
  contentContainer: {
    marginTop: 90,
  },
});

export default function Connect({ connect }) {
  const [address, setAddress] = React.useState("");
  const [port, setPort] = React.useState("");
  const [https, setHttps] = React.useState(false);
  const [saveAddress, setSaveAddress] = React.useState(true);
  const [checking, setChecking] = React.useState(false);

  const zeroConfServers = useZeroconf();

  const checkAddress = async () => {
    setChecking(true);
    checkServerAddress(address, port, https)
      .then((finalAddress) => {
        setChecking(false);
        if (!finalAddress) {
          Alert.alert(
            "Error accessing server",
            "No Thorium server exists at that address."
          );
          return;
        }
        const { address: otherAddress, port, https } = finalAddress;
        if (saveAddress) {
          AsyncStorage.setItem("@Thorium:serverAddress", otherAddress);
          AsyncStorage.setItem("@Thorium:serverPort", port);
        }
        connect(otherAddress, port, https);
      })
      .catch((err) => {
        console.log("I caught an error.");
        console.log(err);
        setChecking(false);
      });
  };
  const handlePressButtonAsync = () => {
    WebBrowser.openBrowserAsync("https://thoriumsim.com");
  };

  const resizeMode = "cover";
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000",
      }}
    >
      {Platform.OS === "ios" && <StatusBar barStyle="light-content" />}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Image
          style={{
            flex: 1,
            resizeMode,
          }}
          source={require("../assets/images/background.jpg")}
        />
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {checking ? (
          <View
            style={{
              flex: 1,
              backgroundColor: "transparent",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 30 }}>
              Checking Server Address...
            </Text>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              backgroundColor: "transparent",
              // justifyContent: "center",
              alignItems: "center",
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
                color: "white",
              }}
            >
              Thorium{" "}
            </Text>
            <View>
              <Text style={{ color: "white", textAlign: "center" }}>
                Enter the Thorium Server address
              </Text>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 12,
                }}
              >
                <Text
                  style={{
                    width: 80,
                    textAlign: "right",
                    color: "white",
                    marginRight: 4,
                  }}
                >
                  Hostname
                </Text>
                <TextInput
                  style={{
                    flex: 1,
                    height: 40,
                    borderColor: "gray",
                    borderWidth: 1,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    color: "white",
                    borderRadius: 10,
                  }}
                  value={address}
                  onChangeText={(text) => setAddress(text)}
                />
              </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 12,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "right",
                    width: 80,
                    marginRight: 4,
                  }}
                >
                  Port
                </Text>
                <TextInput
                  style={{
                    flex: 1,
                    height: 40,
                    borderColor: "gray",
                    borderWidth: 1,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    color: "white",
                    borderRadius: 10,
                  }}
                  keyboardType="number-pad"
                  value={port}
                  onChangeText={(text) => setPort(text)}
                />
              </View>
              {/* <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 12,
                }}
              >
                <Text
                  style={{
                    textAlign: "right",
                    width: 80,
                    color: "white",
                    marginRight: 4,
                  }}
                >
                  HTTPS?
                </Text>
                <Switch
                  value={https}
                  onValueChange={(value) => setHttps(value)}
                />
              </View> */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingTop: 20,
                }}
              >
                <Text
                  style={{
                    textAlign: "right",
                    width: 80,
                    color: "white",
                    marginRight: 4,
                  }}
                >
                  Save server address
                </Text>
                <Switch
                  value={saveAddress}
                  onValueChange={(value) => setSaveAddress(value)}
                />
              </View>
              <Button onPress={checkAddress} title="Connect" color="#841584" />

              {Platform.OS !== "android" && (
                <TouchableOpacity
                  style={{ marginTop: 20 }}
                  onPress={handlePressButtonAsync}
                >
                  <Text style={{ color: "#157EFB", textAlign: "center" }}>
                    Get Thorium Server
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View>
              {zeroConfServers.map((z) => (
                <TouchableOpacity
                  key={z.name}
                  style={{ marginTop: 20 }}
                  onPress={() => {
                    setAddress(z.address);
                    setPort(z.port.toString());
                    setHttps(z.https);
                    console.log(z);
                  }}
                >
                  <Text style={{ color: "#157EFB", textAlign: "center" }}>
                    {z.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
