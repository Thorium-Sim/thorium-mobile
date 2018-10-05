import React, { Component } from "react";
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // You can also log error messages to an error reporting service here
  }
  render() {
    if (this.state.errorInfo) {
      // Error path
      if (this.props.render) return this.props.render;
      return (
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ size: 40, color: "white" }}>
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
