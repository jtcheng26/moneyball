import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useState } from "react";
import {
  useFonts,
  FiraCode_700Bold,
  FiraCode_400Regular,
} from "@expo-google-fonts/fira-code";
import { ThemeColor, THEME_COLORS } from "../../../theme";
import BoxScore from "../scoreboard/BoxScore";
import BodyText from "../text/BodyText";
import LabelText from "../text/LabelText";
import IconButton from "../buttons/icon-button/IconButton";

interface SummaryStatProps {
  stat: number | string;
  title: string;
  onPress?: () => void;
  pressable?: boolean;
  width?: number;
  height?: number;
  underline?: boolean;
  status: "GOOD" | "BAD" | "NEUTRAL";
}

export default function SummaryStat({
  stat,
  title,
  onPress,
  pressable,
  width,
  height,
  underline,
  status,
}: SummaryStatProps) {
  const [press, setPress] = useState(false);
  const [fontsLoaded] = useFonts({
    FiraCode_700Bold,
    FiraCode_400Regular,
  });

  const color = {
    GOOD: THEME_COLORS.green[500],
    BAD: THEME_COLORS.red[500],
    NEUTRAL: THEME_COLORS.dark[200],
  }[status];

  const icon = {
    GOOD: "UpArrow",
    BAD: "DownArrow",
    NEUTRAL: "",
  }[status];

  const bgColor = THEME_COLORS.dark[500];

  const summaryStyles = StyleSheet.create({
    summary: {
      width: width || 310,
      height: height || 70,
      backgroundColor: press ? bgColor.underline : bgColor.color,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    center: {
      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingHorizontal: 10,
      width: width ? width : 310 - 80 - 80,
    },
  });

  return fontsLoaded ? (
    <Pressable
      onPressIn={() => {
        console.log("press");
        if (pressable) setPress(true);
      }}
      onPress={() => {
        if (onPress) onPress();
      }}
      onPressOut={() => setPress(false)}
    >
      <View style={summaryStyles.summary}>
        <BoxScore
          underline={underline}
          color={color}
          value={stat}
          width={height || 70}
          height={height || 70}
          size={24}
        />
        <View style={summaryStyles.center}>
          <LabelText
            flex
            size={20}
            text={title.toUpperCase()}
            color={THEME_COLORS.dark[50]}
          />
        </View>
        <View
          style={{
            marginLeft: "auto",
            width: height || 70,
            paddingHorizontal: 15,
          }}
        >
          <IconButton icon={icon} color={color} invert iconSize={40} disabled />
        </View>
      </View>
    </Pressable>
  ) : (
    <View>
      <Text>Loading</Text>
    </View>
  );
}
