import React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo";
import Color from "color";

const alerts = {
  5: "#2ba1cb",
  4: "#36c236",
  3: "#acac34",
  2: "#cc7926",
  1: "#ca2a2a",
  p: "#7a24cf"
};

const Layout = ({ alertlevel }) => {
  const alertColor = Color(alerts[alertlevel])
    .darken(0.35)
    .toString();

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%"
      }}
      transform={[{ rotateZ: "45deg" }, { scale: 2.5 }]}
    >
      <LinearGradient
        colors={["#000", alertColor, "#000"]}
        start={[0.3, 0.3]}
        end={[0.7, 0.7]}
        style={{ height: "100%", width: "100%" }}
      />
    </View>
  );
};
export default Layout;
