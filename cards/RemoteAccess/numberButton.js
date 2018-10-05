import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const NumberButton = ({ onPress, content }) => {
  return (
    <TouchableOpacity
      onPress={onPress ? () => onPress(content) : () => {}}
      style={{
        borderColor: "white",
        borderWidth: 2,
        borderStyle: "solid",
        borderRadius: 50,
        width: 80,
        height: 80,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Text style={{ color: "white", fontSize: 40 }}>{content}</Text>
    </TouchableOpacity>
  );
};
export default NumberButton;
