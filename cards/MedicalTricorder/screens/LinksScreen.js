import React from "react";
import { ScrollView, View, StyleSheet, Animated, Easing } from "react-native";
import { Audio } from "expo";
import { ExpoLinksView } from "@expo/samples";

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: "Sterifield"
  };
  state = { hue: new Animated.Value(0) };
  async componentDidMount() {
    this.soundObject = new Audio.Sound();

    this.animate();
    // Play a sound
    try {
      await this.soundObject.loadAsync(
        require("../../../assets/sounds/scan.m4a")
      );
      await this.soundObject.setIsLoopingAsync(true);
      await this.soundObject.playAsync();
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
  }
  async componentWillUnmount() {
    await this.soundObject.pauseAsync();
    await this.soundObject.stopAsync();
  }
  animate = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.hue, {
          duration: 2000,
          easing: Easing.linear(),
          toValue: 1
        })
      ])
    ).start();
  };
  render() {
    const { hue } = this.state;
    const color = hue.interpolate({
      inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
      outputRange: [
        "rgba(255,0,0,1)",
        "rgba(255,255,0,1)",
        "rgba(0,255,0,1)",
        "rgba(0,255,255,1)",
        "rgba(0,0,255,1)",
        "rgba(255,0,0,1)"
      ]
    });
    console.log(hue);
    return <Animated.View style={{ flex: 1, backgroundColor: color }} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15
    // backgroundColor: '#fff',
  }
});
