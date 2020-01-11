import React, { Component } from "react";
import { View, Text, Alert } from "react-native";
import Constants from 'expo-constants';
import { withApollo } from "react-apollo";
import gql from "graphql-tag";
import NumberButton from "./numberButton";
import Dots from "./dots";

/* Configuration Options
- Remote Access vs Keypad
- Allowed Attempts
- Locked
- Provide Hints
- Random code - vs prescribed code
- Number of digits
*/

class RemoteAccess extends Component {
  state = {
    enteredNums: []
  };
  onPress = value => {
    if (value === "C") {
      return this.setState({ enteredNums: [] });
    }

    this.setState(
      state => ({
        enteredNums: state.enteredNums.concat(value)
      }),
      () => {
        const { code } = this.props;
        const { enteredNums } = this.state;
        if (code.length === enteredNums.length) {
          // Send it to the server
          this.props.client.mutate({
            mutation: gql`
              mutation SetEnteredCode($id: ID!, $code: [Int!]) {
                setKeypadEnteredCode(id: $id, code: $code)
              }
            `,
            variables: { id: Constants.deviceId, code: enteredNums }
          });
          this.setState({
            enteredNums: []
          });
        }
      }
    );
  };
  render() {
    const { enteredNums } = this.state;
    const { locked, code, enteredCode, giveHints } = this.props;
    const success = code.join("") === enteredCode.join("");
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {success || locked ? (
          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              borderColor: "rgba(0,0,0,0.3)",
              borderWidth: 5,
              padding: 10
            }}
          >
            {success ? (
              <Text
                style={{
                  color: "#0f0",
                  fontSize: 40,
                  fontWeight: "800"
                }}
              >
                Access Granted
              </Text>
            ) : (
              <Text
                style={{
                  color: "red",
                  fontSize: 40,
                  fontWeight: "800"
                }}
              >
                Keypad Locked
              </Text>
            )}
          </View>
        ) : (
          <View
            style={{
              minWidth: 300,
              maxWidth: 400
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 20,
                padding: 10
              }}
            >
              Enter Code:
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                padding: 5
              }}
            >
              <NumberButton content={1} onPress={this.onPress} />
              <NumberButton content={2} onPress={this.onPress} />
              <NumberButton content={3} onPress={this.onPress} />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                padding: 5
              }}
            >
              <NumberButton content={4} onPress={this.onPress} />
              <NumberButton content={5} onPress={this.onPress} />
              <NumberButton content={6} onPress={this.onPress} />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                padding: 5
              }}
            >
              <NumberButton content={7} onPress={this.onPress} />
              <NumberButton content={8} onPress={this.onPress} />
              <NumberButton content={9} onPress={this.onPress} />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                padding: 5
              }}
            >
              <View style={{ width: 80 }} />
              <NumberButton content={0} onPress={this.onPress} />
              <NumberButton content={"C"} onPress={this.onPress} />
            </View>
            <Dots
              code={code}
              enteredCode={enteredCode}
              enteredNums={enteredNums}
              giveHints={giveHints}
            />
          </View>
        )}
      </View>
    );
  }
}
export default withApollo(RemoteAccess);
