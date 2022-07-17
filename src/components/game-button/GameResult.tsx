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
import { MatchResults } from "../../data/data.types";
import RecapProfile from "../profile/RecapProfile";
import SessionRecapScreen from "../../screens/SessionRecap";
import Scoreboard from "../lib/scoreboard/Scoreboard";
import SmallScoreboard from "../lib/scoreboard/SmallScoreboard";

type Props = {
  config: GameConfig;
  result: MatchResults;
  big?: boolean;
  onPress?: (config: GameConfig, result: MatchResults) => void;
};

const GameResult = ({ config, result, big, onPress }: Props) => {
  return (
    <>
      <GameCard
        color={big ? THEME_COLORS.dark[200] : config.color}
        width={big ? "100%" : 220}
        height={big ? 340 : 250}
        buttonText={"View Recap"}
        pressable
        onPress={() => {
          if (onPress) onPress(config, result);
        }}
        buttonTextSize={big ? 20 : undefined}
      >
        <View style={styles.center}>
          <RecapProfile
            name={result.user.name}
            trophies={result.user.trophies}
            icon={result.user.icon}
            score={config.numPlayers === 1 ? undefined : result.userScore}
            status={
              config.numPlayers === 1 ||
              ((result.opponentScore || result.opponentScore === 0) &&
                result.userScore > result.opponentScore)
                ? "GOOD"
                : "NEUTRAL"
            }
            height={big ? 64 : 45}
          />
          <View style={{ height: 15 }} />
          {!!result.opponent &&
            (result.opponentScore || result.opponentScore === 0) && (
              <RecapProfile
                name={result.opponent.name}
                trophies={result.opponent.trophies}
                icon={result.opponent.icon}
                score={result.opponentScore}
                status={
                  result.opponentScore > result.userScore ? "BAD" : "NEUTRAL"
                }
                height={big ? 64 : 45}
              />
            )}
          {config.numPlayers === 1 && (
            <SmallScoreboard
              scores={[result.userRecap.make, result.userRecap.miss]}
              timeLeft={result.userRecap.time}
              height={big ? 64 : 45}
              active
              color={THEME_COLORS.dark[800]}
            />
          )}
          <View style={styles.entryFee}>
            <Icon
              name={config.icon}
              fill={!big ? config.color.color : THEME_COLORS.dark[200].color}
              width={big ? 64 : 50}
              height={big ? 64 : 50}
            />
          </View>

          {/* <Icon
            name={config.icon}
            fill={config.color.color}
            width={100}
            height={100}
          />
          <View style={styles.entryFee}>
            <TicketText entryFee={config.entryFee} />
          </View> */}
        </View>
      </GameCard>
    </>
  );
};

export default GameResult;

const styles = StyleSheet.create({
  center: {
    display: "flex",
    // justifyContent: "center",
    alignItems: "center",
    height: "100%",
    position: "relative",
    padding: 15,
  },
  entryFee: {
    position: "absolute",
    left: 15,
    // marginHorizontal: "auto",
    bottom: 10,
  },
});
