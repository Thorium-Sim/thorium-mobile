import React, { Component } from "react";
import { Query } from "react-apollo";
import { View, Text } from "react-native";
import { Constants } from "expo";
import gql from "graphql-tag";
import SubscriptionHelper from "../../helpers/subscriptionHelper";
import Tasks from "./tasks";

const queryData = `
id
values
station
verified
definition
instructions
`;

const QUERY = gql`
  query Tasks($simulatorId: ID!) {
    tasks(simulatorId: $simulatorId) {
${queryData}
    }
  }
`;
const SUBSCRIPTION = gql`
  subscription ScannerTasksUpdate($simulatorId: ID!) {
    tasksUpdate(simulatorId: $simulatorId) {
${queryData}
    }
  }
`;

class TasksData extends Component {
  state = {};
  render() {
    return (
      <Query query={QUERY} variables={{ simulatorId: this.props.simulator.id }}>
        {({ loading, data, subscribeToMore, error }) => {
          if (error)
            return (
              <Text style={{ color: "white", fontSize: 20 }}>
                There was an error loading the scanner. Are you running the
                latest Thorium Server?
              </Text>
            );
          const { tasks = [] } = data;
          if (loading) return null;
          return (
            <SubscriptionHelper
              subscribe={() =>
                subscribeToMore({
                  document: SUBSCRIPTION,
                  variables: { simulatorId: this.props.simulator.id },
                  updateQuery: (previousResult, { subscriptionData }) => {
                    return Object.assign({}, previousResult, {
                      tasks: subscriptionData.data.tasksUpdate
                    });
                  }
                })
              }
            >
              <Tasks {...this.props} tasks={tasks} />
            </SubscriptionHelper>
          );
        }}
      </Query>
    );
  }
}
export default TasksData;