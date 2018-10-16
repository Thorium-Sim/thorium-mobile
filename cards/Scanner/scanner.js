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

const Input = props => (
  <TextInput
    {...props}
    style={{
      borderColor: "rgba(255,255,255,0.5)",
      height: 40,
      borderWidth: 1,
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginHorizontal: 10,
      color: "white",
      borderRadius: 10,
      borderBottomColor: "transparent",
      ...props.style
    }}
  />
);
const Button = props => (
  <TouchableOpacity
    {...props}
    style={{
      backgroundColor: "rgba(0,0,0,0.1)",
      borderWidth: 2,
      borderColor: "rgba(255,255,255,0.5)",
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginHorizontal: 10,
      marginVertical: 5,
      ...props.style
    }}
  >
    <Text
      style={{
        ...props.textStyle,
        color: "white",
        textAlign: "center"
      }}
    >
      {props.children}
    </Text>
  </TouchableOpacity>
);
const Results = ({ scanResults }) => {
  if (scanResults)
    return (
      <View
        style={{
          flex: 2,
          justifyContent: "center",
          alignItems: "stretch",
          width: "100%"
        }}
      >
        <Text
          style={{
            alignSelf: "flex-start",
            color: "white",
            fontSize: 20
          }}
        >
          Results
        </Text>
        <ScrollView
          style={{
            borderRadius: 10,
            borderWidth: 2,
            borderColor: "rgba(255,255,255,0.5)",
            backgroundColor: "rgba(0,0,0,0.1)",
            padding: 10
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 18
            }}
          >
            {scanResults}
          </Text>
        </ScrollView>
      </View>
    );
  return null;
};
export default class Scanner extends React.Component {
  state = { data: this.props.scanRequest };
  render() {
    const {
      id,
      simulator: { alertlevel },
      scanResults,
      scanning
    } = this.props;
    const { data } = this.state;
    return (
      <View style={styles.container}>
        {scanning ? (
          <Fragment>
            <Text style={{ color: "white", fontSize: 25 }}>Scanning...</Text>
            <ActivityIndicator
              style={{ margin: 20 }}
              size="large"
              color="rgba(255,255,255,0.5)"
            />

            <Mutation
              mutation={gql`
                mutation ScannerCancel($id: ID!) {
                  handheldScannerCancel(id: $id)
                }
              `}
            >
              {action => (
                <Button
                  style={{
                    backgroundColor: "rgba(255,0,0,0.1)",
                    borderColor: "rgba(255,100,100,0.5)"
                  }}
                  onPress={() => action({ variables: { id } })}
                >
                  Cancel Scan
                </Button>
              )}
            </Mutation>
          </Fragment>
        ) : (
          <View style={{ flex: 1, alignItems: "stretch", width: "100%" }}>
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
                Scanner
              </Text>
              <Input
                style={{
                  alignSelf: "stretch"
                }}
                value={data}
                placeholder="Scan Input..."
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
                    mutation ScannerScan($id: ID!, $request: String!) {
                      handheldScannerScan(id: $id, request: $request)
                    }
                  `}
                >
                  {action => (
                    <Button
                      style={{ flex: 1 }}
                      onPress={() =>
                        action({ variables: { id, request: this.state.data } })
                      }
                    >
                      Begin Scan
                    </Button>
                  )}
                </Mutation>
              </View>
            </View>
            <Results scanResults={scanResults} />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 20,
    alignItems: "center",

    justifyContent: "center"
  }
});
