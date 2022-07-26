import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Dialog from "./Dialog";
import IconButton from "../buttons/icon-button/IconButton";
import { THEME_COLORS } from "../../../theme";
import CancelButton from "../buttons/CancelButton";
import ConfirmButton from "../buttons/ConfirmButton";
import Spinner from "react-native-spinkit";

type Props = {
  title: string;
  body?: string;
};

const LoadingDialog = (props: Props) => {
  return (
    <Dialog title={props.title} body={props.body}>
      <View style={styles.container}>
        <Spinner type="Circle" color={THEME_COLORS.dark[50].color} />
      </View>
    </Dialog>
  );
};

export default LoadingDialog;

const styles = StyleSheet.create({
  container: {
    marginLeft: "auto",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 20,
    paddingRight: 20,
  },
});
