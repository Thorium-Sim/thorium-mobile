import React, { Component } from "react";
import { View, Dimensions } from "react-native";

import * as comps from "./components";

function parseComponents({ components, config, values }) {
  return components
    .filter(c => Object.keys(comps).includes(c.component.name))
    .map(c => ({
      ...c,
      config: config[c.id] || {},
      value: values[c.id] || {}
    }));
}

class Interfaces extends Component {
  render() {
    const { iFace } = this.props;
    const { height: deviceHeight, width: deviceWidth } = Dimensions.get(
      "window"
    );
    const { width = deviceWidth, height = deviceHeight } =
      iFace.deviceType || {};
    const widthMultiply = deviceWidth / width;
    const heightMultiply = deviceHeight / height;
    const components = parseComponents(iFace);
    return (
      <View
        style={{
          backgroundColor: "black",
          width: deviceWidth,
          height: deviceHeight
        }}
      >
        {components.map(c => {
          const Comp = comps[c.component.name];
          if (c.config.hidden) return null;
          return (
            <View
              key={c.id}
              style={{
                position: "absolute",
                top: c.position.y * heightMultiply,
                left: c.position.x * widthMultiply
              }}
            >
              <Comp {...c} interfaceId={iFace.id} />
            </View>
          );
        })}
      </View>
    );
  }
}
export default Interfaces;
