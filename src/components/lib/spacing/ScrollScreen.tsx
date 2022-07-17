import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { THEME_COLORS } from "../../../theme";

type Props = {
  rf?: React.MutableRefObject<any>;
  children?: React.ReactNode;
};

const ScrollScreen = (props: Props) => {
  return (
    <ScrollView
      ref={props.rf}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {props.children}
    </ScrollView>
  );
};

export default ScrollScreen;

const styles = StyleSheet.create({
  content: {
    width: "100%",
    minHeight: "100%",
    backgroundColor: THEME_COLORS.dark[800].color,
    paddingVertical: 120,
  },
});
