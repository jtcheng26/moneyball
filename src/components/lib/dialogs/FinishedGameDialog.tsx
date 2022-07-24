import { StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { GameConfig } from "../../../configs/gameConfig.types";
import { GameCode, MatchResults, RawMatch } from "../../../data/data.types";
import ActiveGameCard from "../../game-button/ActiveGameCard";
import DialogBanner from "./DialogBanner";
import GameResult from "../../game-button/GameResult";
import { saveRawMatch } from "../../../data/saveGame";
import { THEME_COLORS } from "../../../theme";
import TitleText from "../text/TitleText";
import Icon from "../buttons/icon-button/Icon";

type Props = {
  onCancel: () => void;
  config: GameConfig;
  game?: RawMatch;
  bannerText?: string;
  onSave: (matches: RawMatch[]) => void;
  userID: string;
  onPress: (config: GameConfig, result: MatchResults) => void;
};

const FinishedGameDialog = ({
  onCancel,
  config,
  game,
  bannerText,
  userID,
  onSave,
  onPress,
}: Props) => {
  const [result, setResult] = useState<MatchResults>();
  useMemo(() => {
    if (game) {
      (async () => {
        const res = await saveRawMatch(game, userID);
        setResult(res);
        onSave([]);
      })();
    }
  }, [game]);
  function defined(stuff: number | undefined) {
    if (!!stuff || stuff === 0) {
      return stuff;
    }
    return 0;
  }
  const won = defined(result?.userScore) > defined(result?.opponentScore);
  const lost = defined(result?.userScore) < defined(result?.opponentScore);
  const text = won ? "You Won" : lost ? "You Lost" : "Tie Game";
  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Icon
          name={config.icon}
          fill={
            won
              ? THEME_COLORS.green[500].color
              : lost
              ? THEME_COLORS.red[500].color
              : THEME_COLORS.dark[200].color
          }
        />
        <TitleText
          text={text}
          size={40}
          color={
            won
              ? THEME_COLORS.green[500]
              : lost
              ? THEME_COLORS.red[500]
              : config.color
          }
        />
      </View>
      {/* <DialogBanner
        bannerText={bannerText || text}
        bannerColor={
          won
            ? THEME_COLORS.green[500]
            : lost
            ? THEME_COLORS.red[500]
            : config.color
        }
        iconColor={won || lost ? THEME_COLORS.dark[500] : undefined}
        onClose={onCancel}
        titleFont
      /> */}
      {/* <View style={styles.titleContainer}>
        <TitleText
          text={text}
          color={
            won
              ? THEME_COLORS.green[500]
              : lost
              ? THEME_COLORS.red[500]
              : THEME_COLORS.dark[500]
          }
        />
      </View> */}
      {result && (
        <GameResult
          result={result}
          prize={
            config.id === GameCode.HORSE_MATCH ||
            config.id === GameCode.WAGER_MATCH
              ? game?.prize
              : config.id === GameCode.RANKED_MATCH
              ? 100
              : undefined
          }
          config={config}
          big
          onPress={() => onPress(config, result)}
        />
      )}
    </View>
  );
};

export default FinishedGameDialog;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // paddingHorizontal: 20,
    width: "100%",
  },
  titleContainer: {
    marginRight: "auto",
  },
  banner: {
    display: "flex",
    width: "100%",
    paddingBottom: 5,
  },
});
