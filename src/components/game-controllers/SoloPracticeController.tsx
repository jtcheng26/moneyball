import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { GameState } from "../../hooks/useGameState";
import Scoreboard from "../lib/scoreboard/Scoreboard";
import { useOrientation } from "../../hooks/useOrientation";
import { SafeAreaView } from "react-native-safe-area-context";
import Orientation, { OrientationType } from "react-native-orientation-locker";
import CameraRoll from "@react-native-community/cameraroll";

export type SessionRecap = {
  make: number;
  miss: number;
  time: number;
};

export type GameControllerProps = {
  gameState: GameState;
  updateGameState: (state: GameState) => void;
  greenScore: number;
  redScore: number;
  endSession: (sessionInfo: SessionRecap) => void;
  orientation: OrientationType;
};

// controller handles all game UI and functionality, custom for each mode
const SoloPracticeController = ({
  gameState,
  updateGameState,
  greenScore,
  redScore,
  endSession,
  orientation,
}: GameControllerProps) => {
  const [timePassed, setTimePassed] = useState(0);
  // useEffect(() => {
  //   if (greenScore === 4)
  //     endSession({ make: greenScore, miss: redScore, time: timePassed });
  // }, [greenScore]);

  useEffect(() => {
    if (gameState === "RUNNING") {
      const timer = setInterval(() => {
        setTimePassed(timePassed + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
    if (gameState === "FINISHED") {
      endSession({
        make: greenScore,
        miss: redScore,
        time: timePassed,
      });
    }
  }, [gameState, timePassed]);

  function gameTitle(state: GameState) {
    switch (state) {
      case "PREPARING":
        return "Detecting hoop...";
      case "READY":
        return "Press to Start";
      case "RUNNING":
        return "Solo Practice";
      case "FINISHED":
        return "Finished";
      default:
        return "Preparing...";
    }
  }

  function startGame() {
    console.log("started");
    updateGameState("RUNNING");
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
        title={gameTitle(gameState)}
        timeLeft={gameState === "RUNNING" ? timePassed : undefined}
        active={gameState !== "PREPARING"}
        underline
        pressable={gameState === "READY"}
        onPress={gameState === "READY" ? startGame : undefined}
      />
    </View>
    // </SafeAreaView> */}
  );
};

export default SoloPracticeController;

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
