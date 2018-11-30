import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../../components";
import StepButtons from "./stepButtons";
const damageReportText = (system, steps, stepDamage) => {
  if (system) {
    if (stepDamage) {
      return steps.length > 0
        ? steps[system.damage.currentStep || 0]
        : "No Damage Report";
    }
    return system.damage.report || "No Damage Report";
  }
};

const DamageReport = ({
  systems,
  selectedSystem,
  clearSelected,
  stepDamage,
  verifyStep,
  which
}) => {
  const system = systems.find(s => s.id === selectedSystem);
  const report = system ? system.damage.report : "No Damage Report";
  const steps = report
    ? report.split(/Step [0-9]+:\n/gi).filter(s => s && s !== "\n")
    : [];
  return (
    <View
      style={{
        width: "100%",
        paddingTop: 30,
        paddingLeft: 10,
        paddingRight: 10,
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <View
        style={{
          width: "100%",
          borderBottomColor: "rgba(255,255,255,0.3)",
          borderBottomWidth: 1,
          marginBottom: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end"
        }}
      >
        <TouchableOpacity onPress={clearSelected}>
          <Text
            style={{
              color: "white",
              fontSize: 20
            }}
          >
            <Ionicons name="ios-arrow-back" size={20} color="white" /> Back
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            textAlign: "right",
            paddingLeft: 10,
            flex: 1,
            color: "white",
            fontSize: 30
          }}
        >
          {system.displayName || system.name}
        </Text>
      </View>
      <ScrollView style={{ flex: 1, width: "100%" }}>
        <Text style={{ color: "white", fontSize: 18 }}>
          {damageReportText(system, steps, stepDamage)}
        </Text>
      </ScrollView>
      {damageReportText(system, steps, stepDamage) === "No Damage Report" ? (
        <Mutation
          mutation={gql`
            mutation RequestReport($systemId: ID!) {
              requestDamageReport(systemId: $systemId)
            }
          `}
        >
          {action => (
            <Button
              disabled={system.damage.requested}
              onPress={() => action({ variables: { systemId: system.id } })}
            >
              Request Damage Report
            </Button>
          )}
        </Mutation>
      ) : (
        stepDamage && (
          <StepButtons system={system} steps={steps} verifyStep={verifyStep} />
        )
      )}
    </View>
  );
};
export default DamageReport;
