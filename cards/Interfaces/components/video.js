import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { Video } from "expo";
import { TouchableOpacity } from "react-native";
import { ThoriumAddressContext } from "../../../App";

export class CompVideo extends Component {
  videoRef = React.createRef();
  componentDidUpdate() {
    const { config, value = {} } = this.props;
    const { autoPlay = true } = config;
    const { playing = autoPlay } = value;
    if (playing) {
      this.videoRef.current.playAsync();
    } else {
      this.videoRef.current.pauseAsync();
    }
  }
  render() {
    const { id, interfaceId, config, value = {} } = this.props;
    const { autoPlay = true, loop = true } = config;
    const { playing } = value;
    return (
      <Mutation
        mutation={gql`
          mutation TriggerInterface($id: ID!, $objectId: ID!) {
            triggerInterfaceObject(id: $id, objectId: $objectId)
          }
        `}
        variables={{ id: interfaceId, objectId: id }}
      >
        {action => (
          <TouchableOpacity
            onPress={() => action().catch(err => console.log(err))}
          >
            <ThoriumAddressContext.Consumer>
              {({ address, port }) => (
                <Video
                  ref={this.videoRef}
                  source={{
                    uri: `http://${address}:${port - 1}/assets${config.src}`
                  }}
                  rate={1.0}
                  volume={0}
                  isMuted={false}
                  resizeMode={Video.RESIZE_MODE_STRETCH}
                  shouldPlay={playing || autoPlay}
                  isLooping={loop}
                  style={{
                    width: parseFloat(config.width) || 50,
                    height: parseFloat(config.height) || 50
                  }}
                />
              )}
            </ThoriumAddressContext.Consumer>
          </TouchableOpacity>
        )}
      </Mutation>
    );
  }
}
