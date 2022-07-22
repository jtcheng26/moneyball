import { GameCode } from "../data/data.types";
import { THEME_COLORS } from "../theme";
import { GameConfig } from "./gameConfig.types";
import KotcChallengeController from "../components/game-controllers/KotcChallengeController";
import TicketEventController from "../components/game-controllers/TicketEventController";

export const TicketEventConfig: GameConfig = {
  name: "Ticket Shootout",
  description:
    "Win tickets with every shot! No entry fee! Available once every 12 hours during the event.",
  id: GameCode.KOTC_CHALLENGE,
  color: THEME_COLORS.theme[400],
  icon: "Ticket",
  entryFee: 0,
  local: true, // for now
  numPlayers: 1,
  controller: TicketEventController,
  countEarlyStop: true, // stopping early can't help you, only makes count
};
