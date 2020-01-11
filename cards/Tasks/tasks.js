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
import { Duration } from "luxon";

function getElapsed(time) {
  return Object.entries(
    Duration.fromObject({
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: Math.round(time)
    })
      .normalize()
      .toObject()
  )
    .filter(t => t[0] !== "milliseconds")
    .map(t => t[1].toString().padStart(2, 0))
    .join(":");
}

const TaskEntry = ({ station, tasks }) => {
  return (
    <View>
      <Text style={{ fontSize: 24, color: "white" }}>{station}</Text>
      {tasks
        .concat()
        .sort((a, b) => {
          if (a.timeElapsedInMS < b.timeElapsedInMS) return 1;
          if (a.timeElapsedInMS > b.timeElapsedInMS) return -1;
          return 0;
        })
        .map(t => (
          <View
            key={t.id}
            style={{ marginLeft: 20, marginBottom: 20, flexDirection: "row" }}
          >
            <Text style={{ color: "white", fontSize: 24, lineHeight: 0 }}>
              ·
            </Text>
            <View style={{ paddingLeft: 5 }}>
              <Text style={{ fontSize: 24, color: "white" }}>
                {t.values.name || t.definition}
              </Text>
              <Text
                style={{ color: "white", fontSize: 16, marginVertical: 10 }}
              >
                Time Elapsed: {getElapsed(t.timeElapsedInMS)}
              </Text>
              <Text style={{ color: "white", fontSize: 18 }}>
                {t.instructions}
              </Text>
            </View>
          </View>
        ))}
    </View>
  );
};
export default class Tasks extends React.Component {
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
