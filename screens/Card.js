import React from "react";
import { View, Text } from "react-native";
import * as Cards from "../cards";

const Card = props => {
  // Assume that the station name is the name of the card
  const Comp = Cards[props.station.name];
  if (!Comp)
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white", fontSize: 40 }}>
          No component named {props.station.name}
        </Text>
      </View>
    );
  return <Comp {...props} />;
};
export default Card;
