import { View, Text } from "react-native";
import React from "react";
import CardCarousel from "../lib/cards/card-carousel/CardCarousel";
import { RankedMatchConfig } from "../../configs/rankedMatchConfig";
import { SoloPracticeConfig } from "../../configs/soloPracticeConfig";
import { HorseMatchConfig } from "../../configs/horseMatchConfig";
import GameButton from "../game-button/GameButton";
import { GameConfig } from "../../configs/gameConfig.types";
import { SoloPigConfig } from "../../configs/soloPigConfig";
import { WagerMatchConfig } from "../../configs/wagerMatchConfig";
import useVisualCurrency from "../../hooks/useVisual";

type Props = {
  onPress: (config: GameConfig) => void;
};

const PlayCarousel = (props: Props) => {
  const { tix } = useVisualCurrency();
  return (
    <CardCarousel
      title="Play"
      data={[
        RankedMatchConfig,
        WagerMatchConfig,
        HorseMatchConfig,
        SoloPigConfig,
        SoloPracticeConfig,
      ]}
      renderItem={({ item, index }) => {
        return (
          <GameButton
            config={item}
            onPress={() => props.onPress(item)}
            disabled={tix < item.entryFee}
          />
        );
      }}
    />
  );
};

export default PlayCarousel;
