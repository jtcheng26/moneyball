import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import { useTailwind } from "tailwind-rn/dist";
import { THEME_COLORS } from "../theme";
import { SafeAreaView } from "react-native-safe-area-context";
import GameButton from "../components/game-button/GameButton";
import { SoloPracticeConfig } from "../configs/soloPracticeConfig";
import { LANDSCAPE, OrientationLocker } from "react-native-orientation-locker";
import { GameConfig } from "../configs/gameConfig.types";
import Game from "./Game";

export default function Play() {
  const tw = useTailwind();
  const [game, setGame] = useState(false);
  const [animateClose, setAnimateClose] = useState(true);
  const [gameConfig, setGameConfig] = useState<GameConfig>(SoloPracticeConfig);

  function startGame(config: GameConfig) {
    setGameConfig(config);
    setTimeout(() => {
      setAnimateClose(true);
      setGame(true);
    }, 400);
  }

  function endGame() {
    setAnimateClose(false);
    setTimeout(() => {
      setGame(false);
    }, 400);
    // reload stuff
  }

  return (
    <View style={{ backgroundColor: THEME_COLORS.dark[800].color }}>
      <ScrollView
        contentContainerStyle={[
          tw("w-full h-full flex justify-center px-8"),
          {
            backgroundColor: THEME_COLORS.dark[800].color,
            paddingVertical: 20,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView>
          <GameButton
            config={SoloPracticeConfig}
            startGame={() => startGame(SoloPracticeConfig)}
          />
        </SafeAreaView>
        {game && (
          <Game
            active={animateClose}
            modeConfig={gameConfig}
            endSession={endGame}
          />
        )}
      </ScrollView>
    </View>
  );
}
