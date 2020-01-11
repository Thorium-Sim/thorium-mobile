import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import SubscriptionHelper from "../../helpers/subscriptionHelper";
import SystemList from "./systemList";
import DamageReport from "./damageReport";

const queryData = `
id
name
displayName
damage {
  damaged
  destroyed
  report
  requested
  reactivationCode
  neededReactivationCode
  currentStep
  validate
  which
}
simulatorId
type
`;

const QUERY = gql`
  query Systems($simulatorId: ID!,  $which:String) {
    simulators(id: $simulatorId) {
      id
      stepDamage
      verifyStep
    }
    systems(simulatorId: $simulatorId, extra:true, damageWhich:$which) {
${queryData}
    }
  }
`;
const SUBSCRIPTION = gql`
  subscription SystemsUpdate($simulatorId: ID!, $which: String) {
    systemsUpdate(simulatorId: $simulatorId, extra: true, damageWhich: $which) {
${queryData}
    }
  }
`;

class DamageReportControl extends Component {
  state = {};
  render() {
    let { selectedSystem } = this.state;
    const { systems } = this.props;
    if (!systems.find(s => s.id === selectedSystem)) selectedSystem = null;
    return selectedSystem ? (
      <DamageReport
        {...this.props}
        selectedSystem={selectedSystem}
        clearSelected={() => this.setState({ selectedSystem: null })}
      />
    ) : (
      <SystemList
        {...this.props}
        selectSystem={id => this.setState({ selectedSystem: id })}
        selectedSystem={selectedSystem}
      />
    );
  }
}

class DamageControlData extends Component {
  render() {
    return (
      <Query
        query={QUERY}
        variables={{
          simulatorId: this.props.simulator.id,
          which: this.props.which || "default"
        }}
      >
        {({ loading, data, error, subscribeToMore }) => {
          if (loading || !data) return null;
          const { systems, simulators } = data;
          const [simulator] = simulators;
          return (
            <SubscriptionHelper
              subscribe={() =>
                subscribeToMore({
                  document: SUBSCRIPTION,
                  variables: {
                    simulatorId: this.props.simulator.id,
                    which: this.props.which || "default"
                  },
                  updateQuery: (previousResult, { subscriptionData }) => {
                    return Object.assign({}, previousResult, {
                      systems: subscriptionData.data.systemsUpdate
                    });
                  }
                })
              }
            >
              <DamageReportControl
                {...this.props}
                systems={systems}
                {...simulator}
              />
            </SubscriptionHelper>
          );
        }}
      </Query>
    );
  }
}
export default DamageControlData;
