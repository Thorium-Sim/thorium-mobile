import React from "react";
import { View } from "react-native";
import Dot from "./dot";

const Dots = ({ code, enteredNums, enteredCode, giveHints }) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-around",
      paddingTop: 20
    }}
  >
    {Array(code.length)
      .fill(0)
      .map((n, i) => {
        let hint = false;
        if (code[i] === enteredCode[i]) {
          hint = "on";
        } else if (code[i] > enteredCode[i]) {
          hint = "up";
        } else if (code[i] < enteredCode[i]) {
          hint = "down";
        }
        return (
          <Dot
            key={`num-dot-${i}`}
            filled={enteredNums[i] || enteredNums[i] === 0}
            hint={giveHints ? hint : false}
          />
        );
      })}
  </View>
);
export default Dots;
