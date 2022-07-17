import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Dialog from "./Dialog";
import { THEME_COLORS } from "../../../theme";
import TicketText from "../text/TicketText";
import ColorBox from "../color-box/ColorBox";
import LabelText from "../text/LabelText";
import { GameConfig } from "../../../configs/gameConfig.types";

type Props = {
  config: GameConfig;
  onConfirm?: () => void;
  onCancel?: () => void;
};

const GameRequestDialog = ({ config, onConfirm, onCancel }: Props) => {
  function confirm() {
    // --------------------
    // Send here
    // --------------------
    if (onConfirm) onConfirm();
  }
  return (
    <Dialog
      title={config.name}
      body={config.description}
      bigFont
      bannerText="Game Details"
      bannerColor={THEME_COLORS.theme[400]}
      onClose={onCancel}
    >
      <View style={styles.container}>
        <View style={styles.ticketContainer}>
          <TicketText entryFee={config.entryFee} size={26} />
        </View>
        <ColorBox
          color={THEME_COLORS.theme[400]}
          underline
          width={150}
          height={60}
          pressable
          onPress={confirm}
        >
          <LabelText text="PLAY" color={THEME_COLORS.dark[800]} />
        </ColorBox>
      </View>
    </Dialog>
  );
};

export default GameRequestDialog;

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
