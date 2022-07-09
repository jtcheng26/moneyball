import { useState } from "react";

export type GameState =
  | "INACTIVE"
  | "PREPARING"
  | "READY"
  | "RUNNING"
  | "FINISHED";

export default function useGameState() {
  const [gameState, setGameState] = useState<GameState>("PREPARING");
  return [gameState, setGameState];
}
