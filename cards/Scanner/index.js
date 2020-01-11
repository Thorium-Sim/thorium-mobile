import React, { Component } from "react";
import { Query } from "react-apollo";
import { View, Text } from "react-native";
import Constants from "expo-constants";
import gql from "graphql-tag";
import SubscriptionHelper from "../../helpers/subscriptionHelper";
import Scanner from "./scanner";

const queryData = `
id
scanRequest
scanResults
scanning
`;

const QUERY = gql`
  query Scanner($client: ID!) {
    scanner(client: $client) {
${queryData}
    }
  }
`;
const SUBSCRIPTION = gql`
  subscription ScannerUpdate($client: ID!) {
    scannerUpdate(client: $client) {
${queryData}
    }
  }
`;

class ScannerData extends Component {
  state = {};
  render() {
    return (
      <Query query={QUERY} variables={{ client: Constants.deviceId }}>
        {({ loading, data, subscribeToMore, error }) => {
          if (error)
            return (
              <Text style={{ color: "white", fontSize: 20 }}>
                There was an error loading the scanner. Are you running Thorium
                Server 1.0.19?
              </Text>
            );
          if (loading || !data) return null;
          const { scanner } = data;
          if (!scanner)
            return (
              <Text style={{ color: "white", fontSize: 40 }}>No Scanner</Text>
            );
          return (
            <SubscriptionHelper
              subscribe={() =>
                subscribeToMore({
                  document: SUBSCRIPTION,
                  variables: { client: Constants.deviceId },
                  updateQuery: (previousResult, { subscriptionData }) => {
                    return Object.assign({}, previousResult, {
                      scanner: subscriptionData.data.scannerUpdate
                    });
                  }
                })
              }
            >
              <Scanner {...this.props} {...scanner} />
            </SubscriptionHelper>
          );
        }}
      </Query>
    );
  }
}
export default ScannerData;
