import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { ThemeColor, THEME_COLORS } from "../../../theme";
import { useFonts } from "@expo-google-fonts/montserrat";
import { FiraCode_400Regular } from "@expo-google-fonts/fira-code";
import LabelText from "../text/LabelText";
import BodyText from "../text/BodyText";

type Props = {
  text: string;
  onChange: (text: string) => void;
  bgColor?: ThemeColor;
  label?: string;
  placeholder?: string;
  compact?: boolean;
};

const TextInputBox = (props: Props) => {
  const [fontsLoaded] = useFonts({
    FiraCode_400Regular,
  });
  return fontsLoaded ? (
    <View
      style={{
        marginBottom: props.compact ? 10 : 20,
      }}
    >
      <BodyText color={THEME_COLORS.dark[200]}>
        {props.label ? props.label : "Name"}
      </BodyText>
      <TextInput
        clearTextOnFocus
        style={[
          styles.input,
          {
            backgroundColor: props.bgColor
              ? props.bgColor.color
              : THEME_COLORS.dark[500].color,
            height: props.compact ? 40 : 60,
          },
        ]}
        onChangeText={props.onChange}
        value={props.text}
        placeholder={props.placeholder || "Type here..."}
        placeholderTextColor={THEME_COLORS.dark[200].color}
      />
    </View>
  ) : (
    <Text>Loading..</Text>
  );
};

export default TextInputBox;

const styles = StyleSheet.create({
  input: {
    marginTop: 5,
    // width: "100%",
    fontFamily: "FiraCode_400Regular",
    fontSize: 15,
    paddingHorizontal: 15,
    color: THEME_COLORS.dark[50].color,
    // color:
  },
});
