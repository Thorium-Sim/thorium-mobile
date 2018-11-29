import React, { Component } from "react";
import { View, Text } from "react-native";
import gql from "graphql-tag";
import { withApollo } from "react-apollo";
import Toast, { DURATION } from "react-native-easy-toast";

const NOTIFY_SUB = gql`
  subscription Notifications($simulatorId: ID!, $station: String) {
    notify(simulatorId: $simulatorId, station: $station) {
      id
      title
      body
      type
      color
      duration
    }
  }
`;

class Alerts extends Component {
  componentDidMount() {
    if (!this.props.simulator || !this.props.station) return;
    this.subscription = this.props.client
      .subscribe({
        query: NOTIFY_SUB,
        variables: {
          simulatorId: this.props.simulator.id,
          station: this.props.station.name
        }
      })
      .subscribe({
        next: ({ data: { notify } }) => {
          console.log(notify);
          // ... call updateQuery to integrate the new comment
          // into the existing list of comments
          if (notify && notify.id) {
            this.trigger(notify);
          }
        },
        error(err) {
          console.error("err", err);
        }
      });
  }
  componentWillUnmount() {
    this.subscription && this.subscription.unsubscribe();
  }
  trigger(props) {
    this.toastRef.current &&
      this.toastRef.current.show(<ToastElement {...props} />, 3000);
  }
  toastRef = React.createRef();
  render() {
    return <Toast position={"top"} positionValue={0} ref={this.toastRef} />;
  }
}

class ToastElement extends Component {
  render() {
    const { title, body } = this.props;
    return (
      <View
      // style={{
      //   minHeight: 50,
      //   backgroundColor: "rgba(0,0,0,0.5)",
      //   borderColor: "rgba(255,255,255,0.5)",
      //   borderBottomWidth: 2,
      //   padding: 10
      // }}
      >
        <Text
          style={{
            fontSize: 20,
            color: "white"
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: "white"
          }}
        >
          {body}
        </Text>
      </View>
    );
  }
}

export default withApollo(Alerts);
