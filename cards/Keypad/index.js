import React, { Component } from "react";
import { Query } from "react-apollo";
import { Constants } from "expo";
import gql from "graphql-tag";
import { Text } from "react-native";
import SubscriptionHelper from "../../helpers/subscriptionHelper";
import Keypad from "./keypad";

const queryData = `
id
code
enteredCode
codeLength
giveHints
allowedAttempts
attempts
locked
`;

const QUERY = gql`
  query Keypad($client: ID!) {
    keypad(client: $client) {
${queryData}
    }
  }
`;
const SUBSCRIPTION = gql`
  subscription KeypadUpdate($client: ID!) {
    keypadUpdate(client: $client) {
${queryData}
    }
  }
`;

class KeypadData extends Component {
  state = {};
  render() {
    return (
      <Query query={QUERY} variables={{ client: Constants.deviceName }}>
        {({ loading, data, subscribeToMore }) => {
          const { keypad } = data;
          if (loading) return null;
          if (!keypad) return <Text style={{ color: "white" }}>No Keypad</Text>;
          return (
            <SubscriptionHelper
              subscribe={() =>
                subscribeToMore({
                  document: SUBSCRIPTION,
                  variables: { client: Constants.deviceId },
                  updateQuery: (previousResult, { subscriptionData }) => {
                    return Object.assign({}, previousResult, {
                      keypad: subscriptionData.data.keypadUpdate
                    });
                  }
                })
              }
            >
              <Keypad {...this.props} {...keypad} />
            </SubscriptionHelper>
          );
        }}
      </Query>
    );
  }
}
export default KeypadData;
