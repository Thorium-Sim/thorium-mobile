import React from "react";
import { Animated, View, Text } from "react-native";
import { ApolloProvider } from "react-apollo";
import ErrorBoundary from "../helpers/errorBounardy";
import Layout from "./Layout";
import ClientData from "./ClientData";

const Client = ({ client }) => {
  if (!client)
    return (
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <Text style={{ fontSize: 40, color: "white" }}>Loading Client...</Text>
      </View>
    );
  return (
    <ApolloProvider client={client}>
      <ErrorBoundary>
        <ClientData />
      </ErrorBoundary>
    </ApolloProvider>
  );
};

export default Client;
