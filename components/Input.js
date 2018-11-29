import React from "react";
import { TextInput } from "react-native";

const Input = props => (
  <TextInput
    {...props}
    style={{
      borderColor: "rgba(255,255,255,0.5)",
      height: 40,
      borderWidth: 1,
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginHorizontal: 10,
      color: "white",
      borderRadius: 10,
      borderBottomColor: "transparent",
      ...props.style
    }}
  />
);

export default Input;
