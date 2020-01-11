import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { Image, TouchableOpacity, View, Text } from "react-native";
import { ThoriumAddressContext } from "../../../helpers/ThoriumAddressContext";

export const CompImage = ({ id, interfaceId, config }) => {
  return (
    <View style={{ alignItems: "center" }}>
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
      {config.label && <Text style={{ color: "white" }}>{config.label}</Text>}
    </View>
  );
};
