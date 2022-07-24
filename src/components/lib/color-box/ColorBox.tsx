import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { ThemeColor } from "../../../theme";

export interface ColorBoxProps {
  color: ThemeColor;
  width?: number | string;
  height?: number;
  pressable?: boolean;
  onPress?: () => void;
  children?: React.ReactNode;
  underline?: boolean;
  flex?: boolean;
  leftAlign?: boolean;
}

export default function ColorBox({
  color,
  width,
  height,
  pressable,
  onPress,
  children,
  underline,
  flex,
  leftAlign,
}: ColorBoxProps) {
  const [pressed, setPressed] = useState(false);
  const dynamicStyles = {
    height: height || "auto",
    width: !flex && width ? width : "auto",
    backgroundColor: pressed ? color.underline : color.color,
    borderBottomColor: color.underline,
    borderBottomWidth: !underline ? 0 : (height ? height : 45) / 9,
    alignItems: leftAlign ? "flex-start" : "center",
    paddingHorizontal: leftAlign ? 10 : 0,
    paddingVertical: leftAlign ? 5 : 0,
  };
  return (
    <Pressable
      disabled={!pressable}
      onPressIn={() => {
        if (pressable) {
          setPressed(true);
        }
      }}
      onPressOut={() => setPressed(false)}
      onPress={() => {
        if (onPress) onPress();
      }}
    >
      <View style={[dynamicStyles, styles.box]}>{children}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    display: "flex",
    justifyContent: "center",
    // height: 80,
    // width: 80,
    // backgroundColor: color.color,
    // borderColor: color.underline,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    // borderBottomWidth: 8,
  },
});
