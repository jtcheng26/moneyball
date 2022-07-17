import { GameCode } from "../data/data.types";
import { THEME_COLORS } from "../theme";
import { GameConfig } from "./gameConfig.types";
import HorseMatchController from "../components/game-controllers/HorseMatchController";

export const HorseMatchConfig: GameConfig = {
  name: "HORSE",
  description:
    "Best your opponent to win $BALL Tokens in a classic game of HORSE. Hit as many shots as you can before reaching 5 misses!",
  id: GameCode.HORSE_MATCH,
  color: THEME_COLORS.horse[500],
  icon: "Horse",
  entryFee: 50,
  local: false,
  numPlayers: 2,
  controller: HorseMatchController,
  countEarlyStop: true, // stopping early can't help you, only makes count
};
