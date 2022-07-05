import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useState } from "react";
import {
  useFonts,
  FiraCode_700Bold,
  FiraCode_400Regular,
} from "@expo-google-fonts/fira-code";
import { ThemeColor, THEME_COLORS } from "../../../theme";
import BoxScore from "./BoxScore";
import BodyText from "../text/BodyText";
import LabelText from "../text/LabelText";

interface ScoreboardProps {
  scores: number[];
  timeLeft?: number; // time in seconds
  title: string;
  active?: boolean;
  onPress?: () => void;
  pressable?: boolean;
  width?: number;
  height?: number;
  underline?: boolean;
  color?: ThemeColor;
}

export default function Scoreboard({
  scores,
  timeLeft,
  title,
  active,
  onPress,
  pressable,
  width,
  height,
  underline,
  color,
}: ScoreboardProps) {
  const [press, setPress] = useState(false);
  const [fontsLoaded] = useFonts({
    FiraCode_700Bold,
    FiraCode_400Regular,
  });

  const bgColor = color || THEME_COLORS.dark[500];

  const ScoreboardStyles = StyleSheet.create({
    scoreboard: {
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

  const dateString = timeLeft
    ? `${Math.floor(timeLeft / 60)}:${
        timeLeft % 60 < 10 ? "0" + (timeLeft % 60) : timeLeft % 60
      }`
    : "";

  return fontsLoaded ? (
    <Pressable
      onPressIn={() => {
        if (pressable) {
          setPress(true);
          if (onPress) onPress();
        }
      }}
      onPressOut={() => setPress(false)}
    >
      <View style={ScoreboardStyles.scoreboard}>
        <BoxScore
          underline={underline}
          color={THEME_COLORS.green[500]}
          value={scores[0]}
          width={height || 70}
          height={height || 70}
        />
        <View style={ScoreboardStyles.center}>
          {dateString ? (
            <>
              <BodyText
                size={13}
                color={active ? THEME_COLORS.theme[50] : THEME_COLORS.dark[200]}
              >
                {title.toUpperCase()}
              </BodyText>
              <LabelText
                size={30}
                text={dateString}
                color={active ? THEME_COLORS.theme[50] : THEME_COLORS.dark[200]}
              />
            </>
          ) : (
            <LabelText
              size={20}
              text={dateString}
              color={active ? THEME_COLORS.theme[50] : THEME_COLORS.dark[200]}
            />
          )}
        </View>
        <View style={{ marginLeft: "auto" }}>
          <BoxScore
            underline={underline}
            color={THEME_COLORS.red[500]}
            value={scores[0]}
            width={height || 70}
            height={height || 70}
          />
        </View>
      </View>
    </Pressable>
  ) : (
    <View>
      <Text>Loading</Text>
    </View>
  );
}
