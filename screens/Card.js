import React from "react";
import { Animated, PixelRatio, Dimensions, View, Text } from "react-native";
import * as Cards from "../cards";
import deviceDimensions from "../helpers/deviceDimensions";
class Card extends React.Component {
  state = {
    orientation: deviceDimensions.isPortrait() ? "portrait" : "landscape",
    deviceType: deviceDimensions.isTablet() ? "tablet" : "phone",
    fadeAnim: new Animated.Value(1)
  };
  duration = 200;
  // Event Listener for orientation changes
  changeOrientation = () => {
    Animated.timing(this.state.fadeAnim, {
      toValue: 0,
      duration: this.duration
    }).start(() => {
      this.setState(
        {
          orientation: deviceDimensions.isPortrait() ? "portrait" : "landscape"
        },
        () => {
          Animated.timing(this.state.fadeAnim, {
            toValue: 1,
            duration: this.duration
          }).start();
        }
      );
    });
  };
  componentDidMount() {
    Dimensions.addEventListener("change", this.changeOrientation);
  }
  componentWillUnmount() {
    Dimensions.removeEventListener("change", this.changeOrientation);
  }
  render() {
    // Assume that the station name is the name of the card
    const { fadeAnim, orientation } = this.state;
    const Comp = Cards[this.props.station.name];
    if (!Comp)
      return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 40 }}>
            No component named {this.props.station.name}
          </Text>
        </View>
      );
    const { height, width } = Dimensions.get("window");
    console.log(orientation);
    return (
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <View
          style={{
            flex: 1,
            transform: [
              { rotate: orientation === "landscape" ? "90deg" : "0deg" }
            ]
            //  height,
            // width
          }}
        >
          <Comp {...this.props} />
        </View>
      </Animated.View>
    );
  }
}
export default Card;
