import { GameCode } from "../data/data.types";
import { THEME_COLORS } from "../theme";
import { GameConfig } from "./gameConfig.types";
import KotcChallengeController from "../components/game-controllers/KotcChallengeController";

export const KotcChallengeConfig: GameConfig = {
  name: "King of the Court",
  description:
    "Beat the king in a head-to-head ranked match to win an NFT and take the crown! By owning a court, you automatically earn tickets whenever a local player spends them!",
  id: GameCode.KOTC_CHALLENGE,
  color: THEME_COLORS.theme[400],
  icon: "Crown",
  entryFee: 0,
  local: true, // for now
  numPlayers: 1,
  controller: KotcChallengeController,
  countEarlyStop: true, // stopping early can't help you, only makes count
};
