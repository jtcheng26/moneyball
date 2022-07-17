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
import IconButton from "../lib/buttons/icon-button/IconButton";
import Spinner from "react-native-spinkit";

type Props = {
  config: GameConfig;
};

const PendingGameCard = ({ config }: Props) => {
  return (
    <GameCard
      color={THEME_COLORS.dark[200]}
      width={220}
      height={250}
      buttonText={"Searching for match"}
      pressable={false}
    >
      <View style={styles.center}>
        <Spinner
          isVisible={true}
          size={60}
          type="Circle"
          color={config.color.color}
        />
        <View style={styles.entryFee}>
          <IconButton
            icon={config.icon}
            color={config.color}
            invert
            disabled
            // labelProps={{
            //   text: config.name,
            //   color: config.color,
            //   size: 18,
            //   flex: true,
            // }}
            // iconSize={30}
          />
        </View>
      </View>
    </GameCard>
  );
};

export default PendingGameCard;

const styles = StyleSheet.create({
  center: {
    display: "flex",
    justifyContent: "center",
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
