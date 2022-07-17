import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Dialog from "./Dialog";
import { THEME_COLORS } from "../../../theme";
import TicketText from "../text/TicketText";
import ColorBox from "../color-box/ColorBox";
import LabelText from "../text/LabelText";

type Props = {
  title: string;
  body: string;
  entryFee: number;
  onConfirm?: () => void;
  onCancel?: () => void;
  disabled?: boolean;
};

const GameConfirmDialog = (props: Props) => {
  return (
    <Dialog
      title={props.title}
      body={props.body}
      bigFont
      bannerText="Game Details"
      bannerColor={THEME_COLORS.theme[400]}
      onClose={props.onCancel}
    >
      <View style={styles.container}>
        <View style={styles.ticketContainer}>
          <TicketText
            entryFee={props.entryFee}
            size={26}
            bad={props.disabled}
          />
        </View>
        <ColorBox
          color={
            props.disabled ? THEME_COLORS.dark[200] : THEME_COLORS.theme[400]
          }
          underline={!props.disabled}
          width={150}
          height={60}
          pressable={!props.disabled}
          onPress={!props.disabled ? props.onConfirm : undefined}
        >
          <LabelText text="PLAY" color={THEME_COLORS.dark[800]} />
        </ColorBox>
      </View>
    </Dialog>
  );
};

export default GameConfirmDialog;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  ticketContainer: {
    flexGrow: 1,
  },
});
