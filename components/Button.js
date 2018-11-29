import React from "react";
import { TouchableOpacity, Text } from "react-native";

const Button = props => (
  <TouchableOpacity
    {...props}
    style={{
      backgroundColor: "rgba(0,0,0,0.1)",
      borderWidth: 2,
      borderColor: "rgba(255,255,255,0.5)",
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginHorizontal: 10,
      marginVertical: 5,
      ...props.style
    }}
  >
    <Text
      style={{
        ...props.textStyle,
        color: "white",
        textAlign: "center"
      }}
    >
      {props.children}
    </Text>
  </TouchableOpacity>
);

export default Button;
