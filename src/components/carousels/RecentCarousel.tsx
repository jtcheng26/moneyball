import { View, Text } from "react-native";
import React from "react";
import CardCarousel from "../lib/cards/card-carousel/CardCarousel";
import { RankedMatchConfig } from "../../configs/rankedMatchConfig";
import { SoloPracticeConfig } from "../../configs/soloPracticeConfig";
import GameButton from "../game-button/GameButton";
import { configFromCode, GameConfig } from "../../configs/gameConfig.types";
import { MatchResults } from "../../data/data.types";
import GameResult from "../game-button/GameResult";

type Props = {
  games: MatchResults[];
  onPress: (config: GameConfig, result: MatchResults) => void;
};

const RecentCarousel = (props: Props) => {
  return (
    <CardCarousel
      title="Recent Games"
      data={props.games}
      renderItem={({ item, index }) => {
        return (
          <GameResult
            config={configFromCode[item.modeCode]}
            result={item}
            onPress={props.onPress}
          />
        );
      }}
    />
  );
};

export default RecentCarousel;
