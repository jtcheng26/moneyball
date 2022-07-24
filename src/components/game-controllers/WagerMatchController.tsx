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
import { THEME_COLORS } from "../../theme";
import LabelText from "../lib/text/LabelText";
import SideIconButton from "../lib/buttons/side-icon-button/SideIconButton";

export function UILocationStylesOverlay(
  orientation: OrientationType,
  flip?: boolean
) {
  if (orientation === "PORTRAIT") {
    return {
      position: "absolute",
      right: flip ? 30 : "auto",
      left: !flip ? 30 : "auto",
      bottom: 80,
    };
  } else if (orientation === "LANDSCAPE-RIGHT") {
    return {
      position: "absolute",
      left: 30,
      bottom: 80,
    };
  } else {
    return {
      position: "absolute",
      right: 30,
      bottom: 80,
    };
  }
}
// controller handles all game UI and functionality, custom for each mode
const WagerMatchController = ({
  gameState,
  updateGameState,
  greenScore,
  redScore,
  endSession,
  orientation,
}: GameControllerProps) => {
  // const GAME_DURATION = 60; // 5 minutes
  const [timePassed, settimePassed] = useState(0);
  // useEffect(() => {
  //   if (greenScore === 4)
  //     endSession({ make: greenScore, miss: redScore, time: timePassed });
  // }, [greenScore]);

  useEffect(() => {
    if (gameState === "RUNNING") {
      const timer = setInterval(() => {
        if (greenScore + redScore >= 10) {
          updateGameState("FINISHED");
          clearInterval(timer);
        } else {
          settimePassed(timePassed + 1);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
    if (gameState === "FINISHED") {
      const recap: SessionRecap = {
        make: greenScore,
        miss: redScore,
        time: timePassed,
        mode: GameCode.RANKED_MATCH,
      };
      endSession(recap);
    }
  }, [gameState, timePassed]);

  function gameTitle(state: GameState) {
    switch (state) {
      case "PREPARING":
        return "Detecting hoop...";
      case "READY":
        return "Press to Start";
      case "RUNNING":
        return "Wager Match";
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
        timePassed={gameState === "RUNNING" ? timePassed : undefined}
        active={gameState !== "PREPARING"}
        underline
        pressable={gameState === "READY"}
        onPress={gameState === "READY" ? startGame : undefined}
      />
      <View style={UILocationStylesOverlay(orientation)}>
        <SideIconButton
          // invert
          icon="CoinStack"
          height={60}
          color={THEME_COLORS.green[500]}
          transparent
          size={22}
          text={` ${Math.max(0, 10 - (greenScore + redScore))} Shot${
            greenScore + redScore === 9 ? "" : "s"
          } Left`}
        />
      </View>
    </View>
    // </SafeAreaView> */}
  );
};

export default WagerMatchController;

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
