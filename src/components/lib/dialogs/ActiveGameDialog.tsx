import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { GameConfig } from "../../../configs/gameConfig.types";
import { RawMatch } from "../../../data/data.types";
import ActiveGameCard from "../../game-button/ActiveGameCard";
import DialogBanner from "./DialogBanner";
import { THEME_COLORS } from "../../../theme";

type Props = {
  onCancel: () => void;
  onConfirm: (config: GameConfig, game?: RawMatch) => void;
  config: GameConfig;
  game: RawMatch;
  bannerText?: string;
  userID: string;
};

const ActiveGameDialog = ({
  onCancel,
  onConfirm,
  config,
  game,
  bannerText,
  userID,
}: Props) => {
  return (
    <View style={styles.container}>
      <DialogBanner
        bannerText={bannerText || "New Game"}
        bannerColor={THEME_COLORS.dark[200]}
        onClose={onCancel}
        titleFont
        iconColor={THEME_COLORS.dark[500]}
      />
      <ActiveGameCard
        config={config}
        game={game}
        startGame={onConfirm}
        big
        userID={userID}
      />
    </View>
  );
};

export default ActiveGameDialog;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 20,
  },
});
