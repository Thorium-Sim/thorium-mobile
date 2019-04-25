import React from "react";
import { TouchableOpacity, Text } from "react-native";

// $alert5: #2ba1cb;
// $alert4: #36c236;
// $alert3: #acac34;
// $alert2: #cc7926;
// $alert1: #ca2a2a;
// $alertp: #7a24cf;

const colorStyle = ({ color, disabled }) => {
  if (disabled) {
    return {
      borderColor: "rgba(100, 100, 100, 0.5)",
      backgroundColor: "rgba(0, 0, 0, 0.8)"
    };
  }
  if (color === "primary") {
    return {
      borderColor: "rgba(0,187,255,0.5)",
      backgroundColor: "rgba(0,187,255,0.1)"
    };
  }
  if (color === "secondary") {
    return {
      borderColor: "rgba(104,35,207,0.5)",
      backgroundColor: "rgba(104,35,207,0.1)"
    };
  }
  if (color === "success") {
    return {
      borderColor: "rgba(54,194,54,0.5)",
      backgroundColor: "rgba(54,194,54,0.1)"
    };
  }
  if (color === "danger") {
    return {
      borderColor: "rgba(201,42,42,0.5)",
      backgroundColor: "rgba(201,42,42,0.1)"
    };
  }
  if (color === "warning") {
    return {
      borderColor: "rgba(171,171,51,0.5)",
      backgroundColor: "rgba(171,171,51,0.1)"
    };
  }
  if (color === "info") {
    return {
      borderColor: "rgba(43,233,233,0.5)",
      backgroundColor: "rgba(43,233,233,0.1)"
    };
  }
  if (color === "light") {
    return {
      borderColor: "rgba(200,200,200,0.8)",
      backgroundColor: "rgba(200,200,200,1)"
    };
  }
  if (color === "dark") {
    return {
      borderColor: "rgba(60,60,60,0.5)",
      backgroundColor: "rgba(60,60,60,0.1)"
    };
  }
  return {
    borderColor: "rgba(255,255,255,0.5)",
    backgroundColor: "rgba(0,0,0,0.1)"
  };
};
const Button = props => (
  <TouchableOpacity
    {...props}
    style={{
      alignSelf: "flex-start",
      borderWidth: 2,
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginHorizontal: 10,
      marginVertical: 5,
      ...colorStyle(props),
      ...props.style
    }}
  >
    <Text
      style={{
        ...props.textStyle,
        color: props.color === "light" ? "#333" : "white",
        textAlign: "center"
      }}
    >
      {props.children}
    </Text>
  </TouchableOpacity>
);

export default Button;
