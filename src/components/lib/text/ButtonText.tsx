import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useFonts, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import { ThemeColor, THEME_COLORS } from "../../../theme";

export interface ButtonTextProps {
  text: string;
  color?: ThemeColor;
  size?: number;
}

export default function ButtonText({ text, color, size }: ButtonTextProps) {
  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });
  const custom = {
    fontSize: size || 20,
    color: color ? color.color : THEME_COLORS.dark[500].color,
  };
  return fontsLoaded ? (
    <Text style={[custom, styles.text]} numberOfLines={1}>
      {text ? text.toUpperCase() : ""}
    </Text>
  ) : (
    <Text>{text}</Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Montserrat_700Bold",
  },
});
