import RankedMatchController from "../components/game-controllers/RankedMatchController";
import { GameCode } from "../data/data.types";
import { THEME_COLORS } from "../theme";
import { GameConfig } from "./gameConfig.types";

export const RankedMatchConfig: GameConfig = {
  name: "Ranked Match",
  description:
    "Compete on the global ladder to earn trophies! Timed 5min match, most baskets wins!",
  id: GameCode.RANKED_MATCH,
  color: THEME_COLORS.theme[500],
  icon: "BallAndHoop",
  entryFee: 50,
  local: false,
  numPlayers: 2,
  controller: RankedMatchController,
  countEarlyStop: true, // stopping early can't help you, only makes count
};
