import { View, Text } from "react-native";
import React from "react";
import { useTailwind } from "tailwind-rn/dist";
import { THEME_COLORS } from "../theme";
import Orientation from "react-native-orientation-locker";

export default function Play() {
  const tw = useTailwind();
  return (
    <View
      style={[
        tw("w-full h-full flex justify-center px-8"),
        { backgroundColor: THEME_COLORS.dark[800].color },
      ]}
    >
      <Text>Stuff</Text>
    </View>
  );
}
