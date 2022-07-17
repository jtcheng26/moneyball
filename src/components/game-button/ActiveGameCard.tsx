import { Modal, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
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
import { MatchResults, RawMatch } from "../../data/data.types";
import RecapProfile from "../profile/RecapProfile";
import SessionRecapScreen from "../../screens/SessionRecap";
import { SoloPracticeConfig } from "../../configs/soloPracticeConfig";
import Scoreboard from "../lib/scoreboard/Scoreboard";
import SmallScoreboard from "../lib/scoreboard/SmallScoreboard";
import useUserData from "../../hooks/useUserData";
import sendSession from "../../hooks/api/score";
import ActiveGameDialog from "../lib/dialogs/ActiveGameDialog";

type Props = {
  config: GameConfig;
  game: RawMatch;
  startGame: (config: GameConfig, game?: RawMatch) => void;
  big?: boolean;
  onPress?: (config: GameConfig, game?: RawMatch) => void;
  hidden?: boolean;
  userID: string;
};

const ActiveGameCard = ({
  config,
  game,
  startGame,
  big,
  onPress,
  hidden,
  userID,
}: Props) => {
  if (hidden) return <View />;
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);
  function playGame() {
    startGame(config, game);
  }
  const user = useMemo(() => {
    return game.players.filter((p) => p.id === userID.toLowerCase())[0];
  }, [game]);
  const opp = useMemo(() => {
    return game.players.filter((p) => p.id !== userID.toLowerCase())[0];
  }, [game]);

  useEffect(() => {
    const timer = setInterval(() => {
      const timeLeftS = Math.floor(game.time_end - Date.now() / 1000);
      if (timeLeftS <= 0) {
        setTimeLeft(0);
        // TODO: end game callback?
      } else {
        setTimeLeft(timeLeftS);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, game]);

  return (
    <>
      <GameCard
        color={user.scored ? THEME_COLORS.dark[200] : config.color}
        width={big ? "100%" : 220}
        height={big ? 340 : 250}
        buttonText={user.scored ? "Waiting for opponent" : "Play"}
        pressable={!user.scored}
        onPress={() => {
          if (onPress) onPress(config, game);
          else playGame();
        }}
        buttonTextSize={big ? 20 : undefined}
      >
        <View style={styles.center}>
          <RecapProfile
            name={opp.name}
            trophies={opp.trophies}
            icon={opp.icon}
            height={big ? 64 : 45}
          />
          <View style={{ height: 15 }} />
          <SmallScoreboard
            scores={[
              user.scored ? user.score : "?",
              opp.scored ? opp.score : "?",
            ]}
            timeLeft={timeLeft}
            title={"REMAINING"}
            height={big ? 64 : 45}
            active
            color={THEME_COLORS.dark[800]}
            fontSize={big ? 34 : undefined}
            centerSize={big ? 18 : undefined}
          />
          <View style={styles.entryFee}>
            <Icon
              name={config.icon}
              fill={config.color.color}
              width={big ? 64 : 50}
              height={big ? 64 : 50}
            />
          </View>
        </View>
      </GameCard>
    </>
  );
};

export default ActiveGameCard;

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
