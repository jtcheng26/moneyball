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
import ColorBox from "../color-box/ColorBox";
import SideIconButton from "../buttons/side-icon-button/SideIconButton";

interface ProfileButtonProps {
  name: string;
  trophies?: number;
  onPress?: () => void;
  underline?: boolean;
  icon: string;
  color: ThemeColor;
  dark?: boolean;
  width?: number | string;
  height?: number;
  score?: number | string;
  status?: "GOOD" | "BAD" | "NEUTRAL";
  king?: boolean;
}

export default function ProfileButton({
  name,
  trophies,
  onPress,
  underline,
  icon,
  color,
  width,
  height,
  score,
  status,
  dark,
  king,
}: ProfileButtonProps) {
  const [press, setPress] = useState(false);
  const [fontsLoaded] = useFonts({
    FiraCode_700Bold,
    FiraCode_400Regular,
  });

  const boxColor = {
    GOOD: THEME_COLORS.green[500],
    BAD: THEME_COLORS.red[500],
    NEUTRAL: THEME_COLORS.dark[200],
  }[status || "NEUTRAL"];

  const bgColor = dark ? THEME_COLORS.dark[800] : THEME_COLORS.dark[500];

  const h = height || 70;

  return fontsLoaded ? (
    <Pressable
      onPressIn={() => {
        console.log("press");
        if (onPress) setPress(true);
      }}
      onPress={() => {
        if (onPress) onPress();
      }}
      onPressOut={() => setPress(false)}
    >
      <View
        style={[
          summaryStyles.summary,
          {
            width: width ? width : "auto",
            height: height || 70,
            backgroundColor: press ? bgColor.underline : bgColor.color,
          },
        ]}
      >
        <IconButton
          icon={icon}
          color={color}
          iconColor={!king ? bgColor : THEME_COLORS.red[500]}
          width={h}
          height={h}
          disabled
          underline={underline}
        />
        <View style={summaryStyles.center}>
          <LabelText
            flex
            size={h >= 70 ? 20 : 16}
            text={name}
            color={THEME_COLORS.dark[50]}
          />
          {(trophies || trophies === 0) && (
            <SideIconButton
              icon="Medal"
              transparent
              color={THEME_COLORS.theme[400]}
              text={trophies + ""}
              height={h >= 70 ? 32 : h >= 60 ? 28 : 26}
              size={h >= 70 ? 18 : h >= 60 ? 16 : 14}
            />
          )}
        </View>
        {status && (score || score === 0) && (
          <View
            style={{
              marginLeft: "auto",
              width: h,
            }}
          >
            <BoxScore
              underline={underline}
              color={boxColor}
              value={score}
              width={h}
              height={h}
              size={h >= 70 ? undefined : 26}
            />
          </View>
        )}
      </View>
    </Pressable>
  ) : (
    <View>
      <Text>Loading</Text>
    </View>
  );
}

const summaryStyles = StyleSheet.create({
  summary: {
    // width: width || 310,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  center: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    // alignItems: "center",
    paddingHorizontal: 20,
    // width: width ? width : 310 - 80 - 80,
  },
});
