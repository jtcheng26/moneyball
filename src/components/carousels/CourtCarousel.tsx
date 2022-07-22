import { View, Text, StyleSheet } from "react-native";
import React from "react";
import CardCarousel from "../lib/cards/card-carousel/CardCarousel";
import { RankedMatchConfig } from "../../configs/rankedMatchConfig";
import { SoloPracticeConfig } from "../../configs/soloPracticeConfig";
import GameButton from "../game-button/GameButton";
import { configFromCode, GameConfig } from "../../configs/gameConfig.types";
import {
  CourtLocation,
  GameCode,
  MatchResults,
  RawMatch,
} from "../../data/data.types";
import GameResult from "../game-button/GameResult";
import ActiveGameCard from "../game-button/ActiveGameCard";
import PendingGameCard from "../game-button/PendingGameCard";
import Carousel from "react-native-snap-carousel";
import CourtCard from "../lib/map/court-card/CourtCard";

type Props = {
  courts: CourtLocation[];
  startGame: (config: GameConfig, court: CourtLocation) => void;
  userID: string;
  onSelect: (court: CourtLocation) => void;
  selected: number;
};

const CourtCarousel = (props: Props) => {
  return (
    <View style={styles.container}>
      <Carousel
        firstItem={props.selected}
        itemWidth={330}
        sliderWidth={380}
        loop
        enableSnap={true}
        inactiveSlideOpacity={1}
        layout="stack"
        data={props.courts}
        layoutCardOffset={15}
        onSnapToItem={(idx) => {
          props.onSelect(props.courts[idx]);
        }}
        renderItem={({ item, index }) => (
          <CourtCard
            location={item}
            onPlay={props.startGame}
            userID={props.userID}
          />
        )}
      />
    </View>
  );
};

export default CourtCarousel;

const styles = StyleSheet.create({
  container: {
    // width: "100%",
    // height: "100%",
    position: "absolute",
    bottom: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
