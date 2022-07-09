import RankedMatchController from "../components/game-controllers/RankedMatchController";
import { THEME_COLORS } from "../theme";
import { GameConfig } from "./gameConfig.types";

export const RankedMatchConfig: GameConfig = {
  name: "Ranked Match",
  description:
    "Compete on the global ladder to earn trophies! Timed 5min match, most baskets wins!",
  id: "ranked-match",
  color: THEME_COLORS.theme[500],
  icon: "BallAndHoop",
  entryFee: 200,
  local: false,
  numPlayers: 2,
  controller: RankedMatchController,
  countEarlyStop: true, // stopping early can't help you, only makes count
};
