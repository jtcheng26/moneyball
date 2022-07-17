import { View, Text } from "react-native";
import React from "react";
import CardCarousel from "../lib/cards/card-carousel/CardCarousel";
import { RankedMatchConfig } from "../../configs/rankedMatchConfig";
import { SoloPracticeConfig } from "../../configs/soloPracticeConfig";
import GameButton from "../game-button/GameButton";
import { configFromCode, GameConfig } from "../../configs/gameConfig.types";
import { GameCode, MatchResults, RawMatch } from "../../data/data.types";
import GameResult from "../game-button/GameResult";
import ActiveGameCard from "../game-button/ActiveGameCard";
import PendingGameCard from "../game-button/PendingGameCard";

type Props = {
  games: (RawMatch | GameCode)[];
  onPress: (config: GameConfig, game?: RawMatch) => void;
  startGame: (config: GameConfig, game?: RawMatch) => void;
  userID: string;
};

const ActiveCarousel = (props: Props) => {
  return (
    <CardCarousel
      title="Active Games"
      data={props.games} // TODO: sort by playable first, waiting last
      renderItem={({ item, index }) => {
        return item.mode_id ? (
          <ActiveGameCard
            config={configFromCode[item.mode_id as GameCode]}
            game={item}
            startGame={props.startGame}
            onPress={props.onPress}
            userID={props.userID}
          />
        ) : (
          <PendingGameCard config={configFromCode[item]} />
        );
      }}
    />
  );
};

export default ActiveCarousel;
