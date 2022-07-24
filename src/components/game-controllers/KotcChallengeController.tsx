import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { GameState } from "../../hooks/useGameState";
import Scoreboard from "../lib/scoreboard/Scoreboard";
import { useOrientation } from "../../hooks/useOrientation";
import { SafeAreaView } from "react-native-safe-area-context";
import Orientation, { OrientationType } from "react-native-orientation-locker";
import CameraRoll from "@react-native-community/cameraroll";
import useUserData from "../../hooks/useUserData";
import { GameCode, MatchResults } from "../../data/data.types";
import SideIconButton from "../lib/buttons/side-icon-button/SideIconButton";
import { UILocationStylesOverlay } from "./RankedMatchController";
import { THEME_COLORS } from "../../theme";
import LocationPill from "../location-pill/LocationPill";
import { GameControllerProps, SessionRecap } from "./SoloPracticeController";
import useVisualCurrency from "../../hooks/useVisual";

// controller handles all game UI and functionality, custom for each mode
const KotcChallengeController = ({
  gameState,
  updateGameState,
  greenScore,
  redScore,
  endSession,
  orientation,
  location,
}: GameControllerProps) => {
  const GAME_DURATION = 300; // 5 minutes
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const { upd } = useVisualCurrency();
  // useEffect(() => {
  //   if (greenScore === 4)
  //     endSession({ make: greenScore, miss: redScore, time: timePassed });
  // }, [greenScore]);

  useEffect(() => {
    if (gameState === "RUNNING") {
      upd({ tokens: 1000 });
      const timer = setInterval(() => {
        if (timeLeft <= 0) {
          updateGameState("FINISHED");
          clearInterval(timer);
        } else {
          setTimeLeft(timeLeft - 1);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
    if (gameState === "FINISHED") {
      const recap: SessionRecap = {
        make: greenScore,
        miss: redScore,
        time: GAME_DURATION,
        mode: GameCode.KOTC_CHALLENGE,
      };
      endSession(recap);
    }
  }, [gameState, timeLeft]);

  function gameTitle(state: GameState) {
    switch (state) {
      case "PREPARING":
        return "Detecting hoop...";
      case "READY":
        return "Press to Start";
      case "RUNNING":
        return "King of the Court";
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
        timeLeft={gameState === "RUNNING" ? timeLeft : undefined}
        active={gameState !== "PREPARING"}
        underline
        pressable={gameState === "READY"}
        onPress={gameState === "READY" ? startGame : undefined}
      />
      <View style={UILocationStylesOverlay(orientation)}>
        <LocationPill name={location ? location : ""} />
      </View>
    </View>
    // </SafeAreaView> */}
  );
};;;;

export default KotcChallengeController;

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
