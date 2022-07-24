import { Modal, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { GameConfig } from "../../configs/gameConfig.types";
import { useTailwind } from "tailwind-rn/dist";
import GameCard from "../lib/cards/GameCard";
import Icon from "../lib/buttons/icon-button/Icon";
import LabelText from "../lib/text/LabelText";
import { THEME_COLORS } from "../../theme";
import ConfirmationDialog from "../lib/dialogs/ConfirmationDialog";
import TicketText from "../lib/text/TicketText";
import GameConfirmDialog from "../lib/dialogs/GameConfirmDialog";
import DarkenedModal from "../lib/dialogs/DarkenedModal";
import GameRequestDialog from "../lib/dialogs/GameRequestDialog";
import { GameCode } from "../../data/data.types";

type Props = {
  config: GameConfig;
  onPress: () => void;
};

const GameButton = ({ config, onPress }: Props) => {
  return (
    <GameCard
      color={config.color}
      width={220}
      height={250}
      buttonText={config.name}
      pressable
      onPress={onPress}
    >
      <View style={styles.center}>
        <Icon
          name={config.icon}
          fill={config.color.color}
          width={100}
          height={100}
        />
        <View style={styles.entryFee}>
          <TicketText
            entryFee={
              config.id === GameCode.WAGER_MATCH ? "50+" : config.entryFee
            }
          />
        </View>
      </View>
    </GameCard>
  );
};

export default GameButton;

const styles = StyleSheet.create({
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    position: "relative",
  },
  entryFee: {
    position: "absolute",
    left: 15,
    bottom: 10,
  },
});
