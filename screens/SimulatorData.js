import React, { Fragment } from "react";
import { View, Text } from "react-native";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import SubscriptionHelper from "../helpers/subscriptionHelper";
import Layout from "./Layout";
import Card from "./Card";
import Alert from "../components/Alert";

const queryData = `
id
name
alertlevel
assets {
  mesh
  texture
  side
  top
  logo
  bridge
}
`;

const QUERY = gql`
  query Simulator($simulatorId: String!) {
    simulators(id: $simulatorId) {
${queryData}
    }
  }
`;
const SUBSCRIPTION = gql`
  subscription SimulatorUpdate($simulatorId: ID!) {
    simulatorsUpdate(simulatorId: $simulatorId) {
${queryData}
    }
  }
`;

const SimulatorData = props => {
  const {
    station: { name },
    station,
    simulator
  } = props;
  return (
    <Query query={QUERY} variables={{ simulatorId: simulator.id }}>
      {({ loading, data, subscribeToMore }) =>
        loading || !data.simulators ? null : (
          <SubscriptionHelper
            subscribe={() =>
              subscribeToMore({
                document: SUBSCRIPTION,
                variables: { simulatorId: simulator.id },
                updateQuery: (previousResult, { subscriptionData }) => {
                  return Object.assign({}, previousResult, {
                    simulators: subscriptionData.data.simulatorsUpdate
                  });
                }
              })
            }
          >
            <Layout {...data.simulators[0]} />
            <Alert simulator={data.simulators[0]} station={station} />

            <Card {...props} simulator={data.simulators[0]} />
          </SubscriptionHelper>
        )
      }
    </Query>
  );
};

export default SimulatorData;
