import React from "react";
import { View, Text } from "react-native";
import { Button } from "../../components";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const StepButtons = ({ system, steps, verifyStep }) => {
  return (
    <Mutation
      mutation={gql`
        mutation SetDamageStep($systemId: ID!, $step: Int!) {
          updateCurrentDamageStep(systemId: $systemId, step: $step)
        }
      `}
    >
      {action => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {!verifyStep && (
            <Button
              style={{ flex: 1 }}
              disabled={!system || system.damage.currentStep === 0}
              onPress={() =>
                action({
                  variables: {
                    systemId: system.id,
                    step: system.damage.currentStep - 1
                  }
                })
              }
            >
              Prev Step
            </Button>
          )}
          <Text style={{ color: "white", fontSize: 18 }}>
            {system && (system.damage.damageReportText || system.damage.report)
              ? system.damage.currentStep + 1
              : 0}{" "}
            / {steps.length}
          </Text>

          {verifyStep ? (
            <Mutation
              mutation={gql`
                mutation SetDamageStepValidation($id: ID!) {
                  setDamageStepValidation(id: $id, validation: true)
                }
              `}
            >
              {action => (
                <Button
                  style={{ flex: 1 }}
                  disabled={
                    !system ||
                    steps.length === 0 ||
                    system.damage.currentStep === steps.length - 1 ||
                    system.damage.validate
                  }
                  onPress={() =>
                    action({
                      variables: {
                        id: system.id
                      }
                    })
                  }
                >
                  {system && system.damage.validate
                    ? "Verifying..."
                    : "Verify Step"}
                </Button>
              )}
            </Mutation>
          ) : (
            <Button
              style={{ flex: 1 }}
              disabled={
                !system ||
                steps.length === 0 ||
                system.damage.currentStep === steps.length - 1
              }
              onPress={() =>
                action({
                  variables: {
                    systemId: system.id,
                    step: system.damage.currentStep + 1
                  }
                })
              }
            >
              Next Step
            </Button>
          )}
        </View>
      )}
    </Mutation>
  );
};

export default StepButtons;
