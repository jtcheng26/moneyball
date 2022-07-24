import RankedMatchController from "../components/game-controllers/RankedMatchController";
import WagerMatchController from "../components/game-controllers/WagerMatchController";
import { GameCode } from "../data/data.types";
import { THEME_COLORS } from "../theme";
import { GameConfig } from "./gameConfig.types";

export const WagerMatchConfig: GameConfig = {
  name: "Wager Match",
  description:
    "Choose an amount of tickets to wager in a 10 shot match - more tickets wagered, more tokens won!",
  id: GameCode.WAGER_MATCH,
  color: THEME_COLORS.green[500],
  icon: "CoinStack",
  entryFee: 50,
  local: false,
  numPlayers: 2,
  controller: WagerMatchController,
  countEarlyStop: true, // stopping early can't help you, only makes count
};
