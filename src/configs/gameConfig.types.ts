import { GameControllerProps } from "../components/game-controllers/SoloPracticeController";
import { GameCode } from "../data/data.types";
import { ThemeColor } from "../theme";
import { HorseMatchConfig } from "./horseMatchConfig";
import { KotcChallengeConfig } from "./kotcChallengeConfig";
import { RankedMatchConfig } from "./rankedMatchConfig";
import { SoloPigConfig } from "./soloPigConfig";
import { SoloPracticeConfig } from "./soloPracticeConfig";
import { TicketEventConfig } from "./ticketEventConfig";
import { WagerMatchConfig } from "./wagerMatchConfig";

export interface GameConfig {
  name: string;
  description: string;
  id: GameCode; // unique mode identifier for server/blockchain
  color: ThemeColor;
  icon: string; // name of svg
  entryFee: number; // in tickets
  local: boolean; // TRUE: 100% on-device, FALSE: partly server/blockchain
  numPlayers: number; // 1 for single-player, 2 for versus
  controller: (props: GameControllerProps) => JSX.Element; // React element that renders scoreboard and handles game logic
  countEarlyStop: boolean; // count stats when stopping early?
}

export const configFromCode: Record<GameCode, GameConfig> = {
  "solo-practice": SoloPracticeConfig,
  "ranked-match": RankedMatchConfig,
  "horse-match": HorseMatchConfig,
  "solo-pig": SoloPigConfig,
  "kotc-challenge": KotcChallengeConfig,
  "ticket-event": TicketEventConfig,
  "wager-match": WagerMatchConfig,
};
