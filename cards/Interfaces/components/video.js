import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { Video } from "expo";
import { TouchableOpacity } from "react-native";
import { ThoriumAddressContext } from "../../../App";

export const CompVideo = ({ id, interfaceId, config }) => {
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
                source={{
                  uri: `http://${address}:${port}/assets${config.src}`
                }}
                rate={1.0}
                volume={0}
                isMuted={false}
                resizeMode={Video.RESIZE_MODE_STRETCH}
                shouldPlay
                isLooping
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
};
