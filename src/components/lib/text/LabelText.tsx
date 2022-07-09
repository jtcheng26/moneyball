import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useFonts, FiraCode_700Bold } from "@expo-google-fonts/fira-code";
import { ThemeColor, THEME_COLORS } from "../../../theme";
import Icon from "../buttons/icon-button/Icon";

export interface LabelTextProps {
  text: string | number;
  color?: ThemeColor;
  size?: number;
  icon?: string;
  flex?: boolean;
}

export default function LabelText({
  flex,
  icon,
  text,
  color,
  size,
}: LabelTextProps) {
  const [fontsLoaded] = useFonts({
    FiraCode_700Bold,
  });
  const custom = {
    fontSize: size || 20,
    color: color ? color.color : THEME_COLORS.dark[50].color,
  };
  return fontsLoaded && !icon ? (
    <Text
      style={[custom, styles.text]}
      numberOfLines={flex ? 0 : 1}
      ellipsizeMode="tail"
    >
      {text}
    </Text>
  ) : fontsLoaded ? (
    <View style={styles.iconText}>
      <Icon
        name={icon}
        fill={color?.color}
        height={size || 20}
        width={size || 20}
      />
      <Text
        style={[
          {
            marginLeft: size ? size / 2 : 10,
          },
          custom,
          styles.text,
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {text}
      </Text>
    </View>
  ) : (
    <Text>{text}</Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "FiraCode_700Bold",
  },
  iconText: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});
