import React, { Component } from "react";
import { View, Text, Alert } from "react-native";

import { Mutation } from "react-apollo";
import { Constants } from "expo";
import gql from "graphql-tag";

import { Button, Input } from "../../components";

class RemoteAccess extends Component {
  state = {};
  render() {
    const { data } = this.state;
    const { simulator, station } = this.props;
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 100
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text
            style={{
              alignSelf: "flex-start",
              marginHorizontal: 10,
              color: "white",
              fontSize: 30
            }}
          >
            Remote Access
          </Text>
          <Input
            style={{
              alignSelf: "stretch"
            }}
            value={data}
            placeholder="Enter Code Here..."
            keyboardAppearance="dark"
            returnKeyLabel="Scan"
            placeholderTextColor="gray"
            onChangeText={text => this.setState({ data: text })}
          />
          <View style={{ flexDirection: "row" }}>
            <Button
              style={{
                flex: 1,
                backgroundColor: "rgba(255,0,0,0.1)",
                borderColor: "rgba(255,100,100,0.5)"
              }}
              onPress={() => this.setState({ data: "" })}
            >
              Clear
            </Button>
            <Mutation
              mutation={gql`
                mutation RemoteAccessCode(
                  $simulatorId: ID!
                  $code: String!
                  $station: String!
                ) {
                  remoteAccessSendCode(
                    simulatorId: $simulatorId
                    code: $code
                    station: $station
                  )
                }
              `}
            >
              {action => (
                <Button
                  disabled={!data}
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(0,255,0,0.1)",
                    borderColor: "rgba(100,255,100,0.5)"
                  }}
                  onPress={() => {
                    action({
                      variables: {
                        simulatorId: simulator.id,
                        station: `${station.name}`,
                        code: data
                      }
                    });
                    this.setState({ data: "" });
                  }}
                >
                  Send Code
                </Button>
              )}
            </Mutation>
          </View>
        </View>
      </View>
    );
  }
}
export default RemoteAccess;
