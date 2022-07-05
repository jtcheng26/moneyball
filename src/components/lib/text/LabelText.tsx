import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useFonts, FiraCode_700Bold } from "@expo-google-fonts/fira-code";
import { ThemeColor, THEME_COLORS } from "../../../theme";

export interface LabelTextProps {
  text: string | number;
  color?: ThemeColor;
  size?: number;
}

export default function LabelText({ text, color, size }: LabelTextProps) {
  const [fontsLoaded] = useFonts({
    FiraCode_700Bold,
  });
  const custom = {
    fontSize: size || 20,
    color: color ? color.color : THEME_COLORS.dark[50].color,
  };
  return fontsLoaded ? (
    <Text style={[custom, styles.text]} numberOfLines={1} ellipsizeMode="tail">
      {text}
    </Text>
  ) : (
    <Text>{text}</Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "FiraCode_700Bold",
  },
});
