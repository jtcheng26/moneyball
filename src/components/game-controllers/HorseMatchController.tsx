import { View, Text, StyleSheet } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { GameState } from "../../hooks/useGameState";
import Scoreboard from "../lib/scoreboard/Scoreboard";
import { useOrientation } from "../../hooks/useOrientation";
import { SafeAreaView } from "react-native-safe-area-context";
import Orientation, { OrientationType } from "react-native-orientation-locker";
import CameraRoll from "@react-native-community/cameraroll";
import useUserData from "../../hooks/useUserData";
import { GameCode, MatchResults } from "../../data/data.types";
import { GameControllerProps, SessionRecap } from "./SoloPracticeController";
import sendSession from "../../hooks/api/score";
import { HorseMatchConfig } from "../../configs/horseMatchConfig";
import { THEME_COLORS } from "../../theme";
import LabelText from "../lib/text/LabelText";
import IconButton from "../lib/buttons/icon-button/IconButton";
import SideIconButton from "../lib/buttons/side-icon-button/SideIconButton";
import { UILocationStylesOverlay } from "./RankedMatchController";

// controller handles all game UI and functionality, custom for each mode
const HorseMatchController = ({
  gameState,
  updateGameState,
  greenScore,
  redScore,
  endSession,
  orientation,
}: GameControllerProps) => {
  const [timeUsed, setTimeUsed] = useState(0);
  // useEffect(() => {
  //   if (greenScore === 4)
  //     endSession({ make: greenScore, miss: redScore, time: timePassed });
  // }, [greenScore]);

  useEffect(() => {
    if (gameState === "RUNNING") {
      const timer = setInterval(() => {
        setTimeUsed(timeUsed + 1);
        if (redScore >= 5) {
          updateGameState("FINISHED");
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
    if (gameState === "FINISHED") {
      const recap: SessionRecap = {
        make: greenScore,
        miss: redScore,
        time: timeUsed,
        mode: GameCode.HORSE_MATCH,
      };
      endSession(recap);
    }
  }, [gameState, timeUsed, redScore]);

  function gameTitle(state: GameState) {
    switch (state) {
      case "PREPARING":
        return "Detecting hoop...";
      case "READY":
        return "Press to Start";
      case "RUNNING":
        return "Horse";
      case "FINISHED":
        return "Finished";
      default:
        return "Preparing...";
    }
  }

  function startGame() {
    console.log("started");
    updateGameState("STARTING");
  }

  function UILocationStyles(orientation: OrientationType) {
    if (orientation === "PORTRAIT") {
      return {
        alignItems: "center",
      };
    } else if (orientation === "LANDSCAPE-RIGHT") {
      return {
        alignItems: "baseline",
        paddingLeft: "5%",
      };
    } else {
      return {
        alignItems: "flex-end",
        paddingRight: "5%",
      };
    }
  }

  return (
    // <SafeAreaView style={styles.container}>
    <View style={[UILocationStyles(orientation), styles.scoreboardContainer]}>
      <Scoreboard
        scores={[greenScore, redScore]}
        title={gameState === "STARTING" ? "Get Ready!" : gameTitle(gameState)}
        timeLeft={gameState === "RUNNING" ? timeUsed : undefined}
        active={gameState !== "PREPARING"}
        underline
        pressable={gameState === "READY"}
        onPress={gameState === "READY" ? startGame : undefined}
      />
      <View style={UILocationStylesOverlay(orientation)}>
        <SideIconButton
          // invert
          text={"HORSE".substring(0, redScore)}
          icon="Horse"
          height={60}
          color={THEME_COLORS.horse[500]}
          transparent
          size={30}
        />
      </View>
    </View>
    // </SafeAreaView> */}
  );
};

export default HorseMatchController;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    // position: "absolute",
    display: "flex",
    flexDirection: "column",
  },
  scoreboardContainer: {
    // position: "absolute",
    marginTop: "auto",
    display: "flex",
    zIndex: 10,
    // justifyContent: "center",
    // alignItems: "center",
  },
});
