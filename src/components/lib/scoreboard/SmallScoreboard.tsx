import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useMemo, useState } from "react";
import {
  useFonts,
  FiraCode_700Bold,
  FiraCode_400Regular,
} from "@expo-google-fonts/fira-code";
import { ThemeColor, THEME_COLORS } from "../../../theme";
import BoxScore from "./BoxScore";
import BodyText from "../text/BodyText";
import LabelText from "../text/LabelText";

interface SmallScoreboardProps {
  scores: (number | string)[];
  timeLeft?: number; // time in seconds
  title?: string;
  active?: boolean;
  width?: number;
  height?: number;
  underline?: boolean;
  color?: ThemeColor;
  fontSize?: number;
  centerSize?: number;
}

export default function SmallScoreboard({
  scores,
  timeLeft,
  title,
  active,
  width,
  height,
  underline,
  color,
  fontSize,
  centerSize,
}: SmallScoreboardProps) {
  const [press, setPress] = useState(false);
  const [fontsLoaded] = useFonts({
    FiraCode_700Bold,
    FiraCode_400Regular,
  });

  const bgColor = color || THEME_COLORS.dark[500];

  const ScoreboardStyles = StyleSheet.create({
    scoreboard: {
      width: width || "100%",
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
      // paddingHorizontal: 10,
      // width: width ? width : 310 - 80 - 80,
    },
  });

  function toStr(n: number, z: boolean = true) {
    return (z && n < 10 ? "0" : "") + Math.floor(n);
  }

  const dateString = useMemo(() => {
    if (timeLeft || timeLeft == 0) {
      const h = timeLeft / (60 * 60);
      const m = (timeLeft % 3600) / 60;
      const s = timeLeft % 60;

      return h >= 1
        ? `${toStr(h)}:${toStr(m)}:${toStr(s)}`
        : `${toStr(m, false)}:${toStr(s)}`;
    }
    return "";
  }, [timeLeft]);

  return fontsLoaded ? (
    <View style={ScoreboardStyles.scoreboard}>
      <BoxScore
        underline={underline}
        color={THEME_COLORS.green[500]}
        value={scores[0]}
        width={height || 70}
        height={height || 70}
        size={fontSize || 26}
      />
      <View style={ScoreboardStyles.center}>
        {dateString ? (
          <>
            {title && (
              <BodyText
                size={centerSize || 13}
                color={active ? THEME_COLORS.theme[50] : THEME_COLORS.dark[200]}
              >
                {title.toUpperCase()}
              </BodyText>
            )}
            <LabelText
              size={centerSize || (title ? 16 : 20)}
              text={dateString}
              color={active ? THEME_COLORS.theme[50] : THEME_COLORS.dark[200]}
            />
          </>
        ) : (
          <LabelText
            flex
            size={centerSize || 20}
            text={title ? title.toUpperCase() : ""}
            color={active ? THEME_COLORS.theme[50] : THEME_COLORS.dark[200]}
          />
        )}
      </View>
      <View style={{ marginLeft: "auto" }}>
        <BoxScore
          underline={underline}
          color={THEME_COLORS.red[500]}
          value={scores[1]}
          width={height || 70}
          height={height || 70}
          size={fontSize || 26}
        />
      </View>
    </View>
  ) : (
    <View>
      <Text>Loading</Text>
    </View>
  );
}
