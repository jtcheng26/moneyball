import { StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { GameConfig } from "../../../configs/gameConfig.types";
import { MatchResults, RawMatch } from "../../../data/data.types";
import ActiveGameCard from "../../game-button/ActiveGameCard";
import DialogBanner from "./DialogBanner";
import GameResult from "../../game-button/GameResult";
import { saveRawMatch } from "../../../data/saveGame";
import { THEME_COLORS } from "../../../theme";
import TitleText from "../text/TitleText";

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
      <DialogBanner
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
      />
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
    paddingHorizontal: 20,
  },
  titleContainer: {
    marginRight: "auto",
  },
});
