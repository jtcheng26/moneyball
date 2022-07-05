import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useFonts, Montserrat_900Black } from "@expo-google-fonts/montserrat";
import { ThemeColor, THEME_COLORS } from "../../../theme";

export interface TitleTextProps {
  text: string;
  color?: ThemeColor;
  size?: number;
}

export default function TitleText({ text, color, size }: TitleTextProps) {
  const [fontsLoaded] = useFonts({
    Montserrat_900Black,
  });
  const custom = {
    fontSize: size || 48,
    color: color ? color.color : THEME_COLORS.dark[0].color,
  };
  return fontsLoaded ? (
    <Text style={[custom, styles.text]}>{text ? text.toUpperCase() : ""}</Text>
  ) : (
    <Text>{text}</Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Montserrat_900Black",
  },
});
