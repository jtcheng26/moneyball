import { StyleSheet, Text, View } from "react-native";
import React from "react";

type Props = {
  children?: React.ReactNode;
};

const PaddedView = (props: Props) => {
  return <View style={styles.view}>{props.children}</View>;
};

export default PaddedView;

const styles = StyleSheet.create({
  view: {
    paddingHorizontal: 30,
    paddingVertical: "5%",
  },
});
