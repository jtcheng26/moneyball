import SoloPracticeController from "../components/game-controllers/SoloPracticeController";
import { THEME_COLORS } from "../theme";
import { GameConfig } from "./gameConfig.types";

export const SoloPracticeConfig: GameConfig = {
  name: "Solo Practice",
  description: "Practice shooting with automated scorekeeping!",
  id: "solo-practice",
  color: THEME_COLORS.theme[50],
  icon: "BasketballHoop",
  entryFee: 0,
  local: true,
  numPlayers: 1,
  controller: SoloPracticeController,
  countEarlyStop: true,
};
