import { GameCode } from "../data/data.types";
import { THEME_COLORS } from "../theme";
import { GameConfig } from "./gameConfig.types";
import SoloPigController from "../components/game-controllers/SoloPigController";

export const SoloPigConfig: GameConfig = {
  name: "Pig",
  description:
    "Practice shooting on your own in a classic game of PIG. Hit as many shots as you can before reaching 3 misses!",
  id: GameCode.SOLO_PIG,
  color: THEME_COLORS.pig[500],
  icon: "Pig",
  entryFee: 0,
  local: true,
  numPlayers: 1,
  controller: SoloPigController,
  countEarlyStop: true,
};
