import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Dialog from "./Dialog";
import IconButton from "../buttons/icon-button/IconButton";
import { THEME_COLORS } from "../../../theme";
import CancelButton from "../buttons/CancelButton";
import ConfirmButton from "../buttons/ConfirmButton";

type Props = {
  title: string;
  body?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

const ConfirmationDialog = (props: Props) => {
  return (
    <Dialog title={props.title} body={props.body}>
      <View style={styles.container}>
        <ConfirmButton onConfirm={props.onConfirm} />
        <View style={{ width: 10 }} />
        <CancelButton onCancel={props.onCancel} />
      </View>
    </Dialog>
  );
};

export default ConfirmationDialog;

const styles = StyleSheet.create({
  container: {
    marginLeft: "auto",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});
