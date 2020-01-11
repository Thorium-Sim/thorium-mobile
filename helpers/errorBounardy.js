import React, { Component } from "react";
import { View, Text } from "react-native";
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error, errorInfo) {
    // Update state so the next render will show the fallback UI.
    console.log(error, errorInfo);
    return { hasError: true, error, errorInfo };
  }

  render() {
    if (this.state.hasError) {
      // Error path
      if (this.props.render) return this.props.render;
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ fontSize: 40, color: "white" }}>
            Error in Thorium client.
          </Text>
          <Text style={{ color: "white" }}>
            {this.state.error && this.state.error.toString()}
          </Text>
        </View>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}
