import React, { Fragment } from "react";
import {
  Image,
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View
} from "react-native";

import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import { Button, Input } from "../../components";

const TaskEntry = ({ station, tasks }) => {
  return (
    <View>
      <Text style={{ fontSize: 24, color: "white" }}>{station}</Text>
      {tasks.map(t => (
        <View key={t.id} style={{ marginLeft: 20, marginBottom: 20 }}>
          <Text style={{ fontSize: 18, color: "white" }}>
            <Text style={{ fontSize: 24, lineHeight: 0 }}>·</Text>{" "}
            {t.values.name || t.definition}: {t.instructions}
          </Text>
        </View>
      ))}
    </View>
  );
};
export default class Scanner extends React.Component {
  render() {
    const { id, tasks } = this.props;
    const separatedTasks = tasks
      .filter(t => !t.verified)
      .reduce((prev, next) => {
        prev[next.station] = prev[next.station]
          ? prev[next.station].concat(next)
          : [next];
        return prev;
      }, {});
    const verifiedTasks = tasks
      .filter(t => t.verified)
      .reduce((prev, next) => {
        prev[next.station] = prev[next.station]
          ? prev[next.station].concat(next)
          : [next];
        return prev;
      }, {});
    return (
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <View
            style={{
              borderBottomColor: "rgba(255,255,255,0.3)",
              borderBottomWidth: 1,
              width: "100%",
              marginBottom: 10
            }}
          >
            <Text
              style={{
                fontSize: 30,
                color: "white"
              }}
            >
              Crew Tasks
            </Text>
          </View>
          {Object.entries(separatedTasks).map(([station, tasks]) => (
            <TaskEntry
              key={`tasks-${station}`}
              station={station}
              tasks={tasks}
            />
          ))}
          <Fragment>
            <View
              style={{
                borderBottomColor: "rgba(255,255,255,0.3)",
                borderBottomWidth: 1,
                width: "100%",
                marginBottom: 10,
                marginTop: 40
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  color: "white"
                }}
              >
                Verified Tasks
              </Text>
            </View>
            {Object.entries(verifiedTasks).map(([station, tasks]) => (
              <TaskEntry
                key={`verified-tasks-${station}`}
                station={station}
                tasks={tasks}
              />
            ))}
          </Fragment>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 20
  }
});
