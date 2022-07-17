import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { THEME_COLORS } from "../../../theme";
import { useFonts } from "@expo-google-fonts/montserrat";
import { FiraCode_400Regular } from "@expo-google-fonts/fira-code";
import LabelText from "../text/LabelText";
import BodyText from "../text/BodyText";

type Props = {
  text: string;
  onChange: (text: string) => void;
};

const TextInputBox = (props: Props) => {
  const [fontsLoaded] = useFonts({
    FiraCode_400Regular,
  });
  return fontsLoaded ? (
    <View style={styles.container}>
      <BodyText color={THEME_COLORS.dark[200]}>Name</BodyText>
      <TextInput
        style={styles.input}
        onChangeText={props.onChange}
        value={props.text}
        placeholder="Type here..."
        placeholderTextColor={THEME_COLORS.dark[200].color}
      />
    </View>
  ) : (
    <Text>Loading..</Text>
  );
};

export default TextInputBox;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  input: {
    marginTop: 5,
    height: 60,
    width: "100%",
    backgroundColor: THEME_COLORS.dark[500].color,
    fontFamily: "FiraCode_400Regular",
    fontSize: 15,
    paddingHorizontal: 15,
    color: THEME_COLORS.dark[50].color,
    // color:
  },
});
