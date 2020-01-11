import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import SubscriptionHelper from "../../helpers/subscriptionHelper";
import EventName from "./EventName";
import { Button } from "../../components";

const queryData = `
id
mission{
  id
  name
  description
  timeline {
    id
    name
    description
    timelineItems {
      id
      name
      event
      args
      delay
    }
  }
}
currentTimelineStep
`;

const QUERY = gql`
  query Simulators($simId: ID!) {
    simulators(id: $simId) {
      ${queryData}
    }
    missions{
      id
      name
    }
  }
`;
const SUBSCRIPTION = gql`
  subscription SimulatorsUpdate($simulatorId: ID!) {
    simulatorsUpdate(simulatorId:$simulatorId) {
      ${queryData}
    }
  }
`;

class MyListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render() {
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View>
          <Text style={{ color: "white", fontSize: 24 }}>
            {this.props.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

class MultiSelectList extends React.PureComponent {
  _keyExtractor = (item, index) => item.id;

  _onPressItem = id => {
    this.props.onPressItem(id);
  };

  _renderItem = ({ item }) => (
    <MyListItem
      id={item.id}
      onPressItem={this._onPressItem}
      title={item.title}
    />
  );

  render() {
    return (
      <FlatList
        style={{ flex: 1, width: "100%" }}
        data={this.props.data}
        extraData={this.state}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}

const MissionView = ({ id, mission, currentTimelineStep }) => {
  const currentStep = mission.timeline[currentTimelineStep];
  const stepCheck = step =>
    Math.max(0, Math.min(mission.timeline.length - 1, step));

  const runMacro = (triggerMacro, updateTimelineStep) => () => {
    if (!currentStep) return;
    const variables = {
      simulatorId: id,
      macros: currentStep.timelineItems.map(t => {
        const args =
          typeof t.args === "string"
            ? JSON.stringify({ ...JSON.parse(t.args) })
            : JSON.stringify({ ...t.args });
        return {
          stepId: t.id,
          event: t.event,
          args,
          delay: t.delay
        };
      })
    };
    triggerMacro({ variables });
    updateTimelineStep &&
      updateTimelineStep({
        variables: {
          simulatorId: id,
          step: currentTimelineStep + 1
        }
      });
  };
  return (
    <React.Fragment>
      <Text style={{ color: "white", fontSize: 40, margin: 30 }}>
        {mission.name}
      </Text>
      <Text style={{ color: "white", fontSize: 24, margin: 10 }}>
        {currentStep
          ? `Step ${currentTimelineStep + 1}: ${currentStep.name}`
          : "End of timeline."}
      </Text>
      {currentStep ? (
        <Text style={{ color: "white", fontSize: 18, margin: 5 }}>
          {currentStep.description}
        </Text>
      ) : null}
      <View style={{ width: "100%", flex: 1 }}>
        {currentStep && (
          <React.Fragment>
            <Text style={{ color: "white", fontSize: 24, margin: 10 }}>
              Actions
            </Text>
            <ScrollView>
              {currentStep.timelineItems.map(t => (
                <Text
                  key={t.id}
                  style={{ color: "white", fontSize: 18, margin: 5 }}
                >
                  <EventName id={t.event} label={t.event} />
                </Text>
              ))}
            </ScrollView>
          </React.Fragment>
        )}
      </View>

      <Mutation
        mutation={gql`
          mutation UpdateTimelineStep($simulatorId: ID!, $step: Int!) {
            setSimulatorTimelineStep(simulatorId: $simulatorId, step: $step)
          }
        `}
      >
        {updateTimelineStep => (
          <View
            style={{
              flexDirection: "row",
              marginBottom: 50
            }}
          >
            <Button
              style={{ flex: 1 }}
              onPress={() =>
                updateTimelineStep({
                  variables: {
                    simulatorId: id,
                    step: stepCheck(currentTimelineStep - 1)
                  }
                })
              }
            >
              {"<-"}
            </Button>
            <Mutation
              mutation={gql`
                mutation ExecuteMacro(
                  $simulatorId: ID!
                  $macros: [MacroInput]!
                ) {
                  triggerMacros(simulatorId: $simulatorId, macros: $macros)
                }
              `}
            >
              {triggerMacro => (
                <Button
                  style={{ flex: 1 }}
                  onPress={runMacro(triggerMacro, updateTimelineStep)}
                >
                  {"Execute"}
                </Button>
              )}
            </Mutation>
            <Button
              style={{ flex: 1 }}
              onPress={() =>
                updateTimelineStep({
                  variables: {
                    simulatorId: id,
                    step: stepCheck(currentTimelineStep + 1)
                  }
                })
              }
            >
              {"->"}
            </Button>
          </View>
        )}
      </Mutation>
    </React.Fragment>
  );
};

class TimelineControl extends Component {
  state = {};
  render() {
    const { id, mission, missions, currentTimelineStep } = this.props;

    return (
      <View
        style={{
          paddingTop: 30,
          paddingLeft: 10,
          paddingRight: 10,
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {mission ? (
          <MissionView
            mission={mission}
            currentTimelineStep={currentTimelineStep}
            id={id}
          />
        ) : (
          <React.Fragment>
            <Text style={{ color: "white", fontSize: 30 }}>
              Choose a mission
            </Text>
            <Mutation
              mutation={gql`
                mutation SetSimulatorMission(
                  $simulatorId: ID!
                  $missionId: ID!
                ) {
                  setSimulatorMission(
                    simulatorId: $simulatorId
                    missionId: $missionId
                  )
                }
              `}
            >
              {action => (
                <MultiSelectList
                  data={missions.map(m => ({ id: m.id, title: m.name }))}
                  onPressItem={missionId => {
                    action({
                      variables: { simulatorId: id, missionId }
                    });
                  }}
                />
              )}
            </Mutation>
          </React.Fragment>
        )}
      </View>
    );
  }
}

class TimelineData extends Component {
  render() {
    return (
      <Query
        query={QUERY}
        variables={{
          simId: this.props.simulator.id
        }}
      >
        {({ loading, data, subscribeToMore }) => {
          if (loading || !data) return null;
          const { simulators, missions } = data;
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
              <TimelineControl
                {...this.props}
                {...simulator}
                missions={missions}
              />
            </SubscriptionHelper>
          );
        }}
      </Query>
    );
  }
}
export default TimelineData;
