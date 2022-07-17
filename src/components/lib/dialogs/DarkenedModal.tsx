import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ThemeColor } from "../../../theme";
import Modal from "react-native-modal";

type Props = {
  children?: React.ReactNode;
  visible?: boolean;
  onDismiss?: () => void;
  allOrientations?: boolean;
  noPadding?: boolean;
};

const DarkenedModal = (props: Props) => {
  return (
    <Modal
      isVisible={props.visible}
      onBackdropPress={props.onDismiss}
      onDismiss={props.onDismiss}
      supportedOrientations={
        props.allOrientations ? ["portrait", "landscape"] : ["portrait"]
      }
      hideModalContentWhileAnimating
      style={{ margin: 0 }}
      useNativeDriver
    >
      <View
        style={[{ paddingHorizontal: props.noPadding ? 0 : 20 }, styles.modal]}
      >
        {props.children}
      </View>
    </Modal>
  );
};

export default DarkenedModal;

const styles = StyleSheet.create({
  modal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // width: "100%",
    // height: "100%",
  },
});
