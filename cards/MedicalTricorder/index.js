import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Scanner from "../Scanner";
import Sterifield from "./sterifield";
const components = { Scanner, Sterifield };

const Toolbar = ({ items, selectedItem, onChange = () => {} }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        height: 60,
        borderTopColor: "rgba(255, 255, 255, 0.5)",
        borderTopWidth: 1,
        backgroundColor: "rgba(0,0,0,0.2)",
        justifyContent: "space-around"
      }}
    >
      {items.map((item, i) => (
        <TouchableOpacity
          key={`${item.name}-${i}`}
          onPress={() => onChange(i)}
          style={{ alignItems: "center" }}
        >
          <View style={{ opacity: selectedItem === i ? 1 : 0.5 }}>
            {item.icon}
          </View>
          <Text
            style={{
              color: "white"
            }}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
class MedicalTricorder extends Component {
  comps = [
    {
      name: "Scanner",
      icon: <Ionicons name="ios-qr-scanner" size={32} color="white" />
    },
    {
      name: "Sterifield",
      icon: <Ionicons name="ios-nuclear" size={32} color="white" />
    }
  ];
  state = { comp: 0 };
  render() {
    const { comp } = this.state;
    const Comp = components[this.comps[comp].name];
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Comp {...this.props} />
        </View>
        <Toolbar
          items={this.comps}
          selectedItem={comp}
          onChange={i => this.setState({ comp: i })}
        />
      </View>
    );
  }
}
export default MedicalTricorder;
