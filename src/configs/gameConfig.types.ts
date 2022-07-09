import { GameControllerProps } from "../components/game-controllers/SoloPracticeController";
import { ThemeColor } from "../theme";

export interface GameConfig {
  name: string;
  description: string;
  id: string; // unique mode identifier for server/blockchain
  color: ThemeColor;
  icon: string; // name of svg
  entryFee: number; // in tickets
  local: boolean; // TRUE: 100% on-device, FALSE: partly server/blockchain
  numPlayers: number; // 1 for single-player, 2 for versus
  controller: (props: GameControllerProps) => JSX.Element; // React element that renders scoreboard and handles game logic
  countEarlyStop: boolean; // count stats when stopping early?
}
