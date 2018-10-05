import React, { Component } from "react";
import { View, Text } from "react-native";
import { Constants } from "expo";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import SubscriptionHelper from "../helpers/subscriptionHelper";
import SimulatorData from "./SimulatorData";
import * as allCards from "../cards";

const cards = Object.keys(allCards);
console.log(cards);
const clientId = Constants.deviceName;

const queryData = `
id
flight {
  id
  name
  date
}
simulator {
  id
  name
}
station {
  name
}
offlineState
training
`;

const QUERY = gql`
  query Client($clientId: ID!) {
    clients(clientId: $clientId) {
${queryData}
    }
  }
`;
const SUBSCRIPTION = gql`
  subscription ClientUpdate($clientId: ID!) {
    clientChanged(client: $clientId) {
${queryData}
    }
  }
`;

class ClientData extends Component {
  componentDidMount() {
    const { client } = this.props;
    // Register the client for the first time.
    setTimeout(() => {
      client.mutate({
        mutation: gql`
          mutation RegisterClient($client: ID!, $cards: [String]) {
            clientConnect(client: $client, mobile: true, cards: $cards)
          }
        `,
        variables: { client: clientId, cards }
      });
    }, 100);
  }
  componentWillUnmount() {
    client.mutate({
      mutation: gql`
        mutation RemoveClient($id: ID!) {
          clientDisconnect(client: $id)
        }
      `,
      variables: { id: clientId }
    });
  }
  render() {
    return (
      <Query query={QUERY} variables={{ clientId }}>
        {({ loading, data, subscribeToMore }) => {
          const { clients } = data;
          if (loading || !clients) return null;
          const client = clients[0];
          return (
            <SubscriptionHelper
              subscribe={() =>
                subscribeToMore({
                  document: SUBSCRIPTION,
                  variables: { clientId },
                  updateQuery: (previousResult, { subscriptionData }) => {
                    return Object.assign({}, previousResult, {
                      clients: subscriptionData.data.clientChanged
                    });
                  }
                })
              }
            >
              {!client || !client.simulator || !client.station ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 10
                  }}
                >
                  <Text
                    style={{
                      fontSize: 30,
                      color: "white",
                      textAlign: "center"
                    }}
                  >
                    Waiting to connect to simulator...
                  </Text>
                  <Text
                    style={{
                      color: "white"
                    }}
                  >
                    ClientId: {Constants.deviceName}
                  </Text>
                  <Text
                    style={{
                      color: "white"
                    }}
                  >
                    Flight: {client && client.flight && client.flight.name}
                  </Text>
                  <Text
                    style={{
                      color: "white"
                    }}
                  >
                    Simulator:{" "}
                    {client && client.simulator && client.simulator.name}
                  </Text>
                </View>
              ) : (
                <SimulatorData {...client} />
              )}
            </SubscriptionHelper>
          );
        }}
      </Query>
    );
  }
}

export default ClientData;
