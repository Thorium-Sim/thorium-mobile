import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function hintIcon(hint) {
  if (hint === "up") return "ios-arrow-dropup";
  if (hint === "down") return "ios-arrow-dropdown";
  if (hint === "on") return "ios-checkmark-circle-outline";
}
const Dot = ({ filled = false, hint }) => {
  return (
    <View
      style={{
        alignItems: "center",
        height: 60
      }}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "white",
          borderStyle: "solid",
          backgroundColor: filled ? "white" : "transparent",
          marginBottom: 10
        }}
      />

      {hint === false ? null : (
        <Ionicons name={hintIcon(hint)} size={32} color="white" />
      )}
    </View>
  );
};
export default Dot;
