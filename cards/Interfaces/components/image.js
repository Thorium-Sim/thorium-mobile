import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { Image, TouchableOpacity } from "react-native";
import { ThoriumAddressContext } from "../../../App";

export const CompImage = ({ id, interfaceId, config }) => {
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
              <React.Fragment>
                <Image
                  style={{
                    width: parseFloat(config.width) || 50,
                    height: parseFloat(config.height) || 50,
                    resizeMode: "stretch"
                  }}
                  source={{
                    uri: `http://${address}:${port - 1}/assets${config.src}`
                  }}
                />
              </React.Fragment>
            )}
          </ThoriumAddressContext.Consumer>
        </TouchableOpacity>
      )}
    </Mutation>
  );
};
