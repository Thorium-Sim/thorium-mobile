import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { Image, TouchableOpacity } from "react-native";
import { ThoriumAddressContext } from "../../../App";

export const CompImage = ({ id, interfaceId, config }) => {
  console.log(config.src);

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
              <Image
                style={{
                  width: parseFloat(config.width) || 50,
                  height: parseFloat(config.height),
                  resizeMode: "stretch"
                }}
                source={{
                  uri: `http://${address}:${port}/assets${config.src}`
                }}
              />
            )}
          </ThoriumAddressContext.Consumer>
        </TouchableOpacity>
      )}
    </Mutation>
  );
};
