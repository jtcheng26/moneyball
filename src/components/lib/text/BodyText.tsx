import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useFonts, FiraCode_400Regular } from "@expo-google-fonts/fira-code";
import { ThemeColor, THEME_COLORS } from "../../../theme";

export interface BodyTextProps {
  children?: React.ReactNode;
  color?: ThemeColor;
  size?: number;
}

export default function BodyText({ children, color, size }: BodyTextProps) {
  const [fontsLoaded] = useFonts({
    FiraCode_400Regular,
  });
  const custom = {
    fontSize: size || 16,
    color: color ? color.color : THEME_COLORS.dark[50].color,
  };
  return fontsLoaded ? (
    <Text style={[custom, styles.text]}>{children}</Text>
  ) : (
    <Text>{children}</Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "FiraCode_400Regular",
  },
});
