import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import React from "react";
import { THEME_COLORS } from "../../../theme";

type Props = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  noFade?: boolean;
  transparent?: boolean;
};

const FadeHeader = (props: Props) => {
  return (
    <View
      style={[
        props.style,
        styles.header,
        {
          backgroundColor: props.transparent
            ? "transparent"
            : THEME_COLORS.dark[800].color,
        },
        props.noFade ? {} : styles.fade,
      ]}
    >
      {props.children}
    </View>
  );
};

export default FadeHeader;

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    paddingTop: 50,
    zIndex: 10,
    width: "100%",
  },
  fade: {
    shadowColor: THEME_COLORS.dark[800].color,
    shadowOffset: {
      width: 0,
      height: 40,
    },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
});
