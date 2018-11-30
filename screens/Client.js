import React, { Component } from "react";
import { Animated, View, Text, Dimensions } from "react-native";
import { getClient } from "../helpers/graphqlClient";
import { ApolloProvider, Query } from "react-apollo";
import ErrorBoundary from "../helpers/errorBounardy";
import Layout from "./Layout";
import ClientData from "./ClientData";
import deviceDimensions from "../helpers/deviceDimensions";
export default class Client extends Component {
  render() {
    const { client } = this.props;
    if (!client)
      return (
        <View style={{ flex: 1, backgroundColor: "black" }}>
          <Text style={{ fontSize: 40, color: "white" }}>
            Loading Client...
          </Text>
        </View>
      );
    return (
      <ApolloProvider client={client}>
        <ErrorBoundary>
          <ClientData />
        </ErrorBoundary>
      </ApolloProvider>
    );
  }
}
