// Dynamic data

import { SessionRecap } from "../components/game-controllers/SoloPracticeController";
import { GameConfig } from "../configs/gameConfig.types";

export enum NotificationCode {
  GAME_REQUEST = 0,
  GAME_START = 2,
  GAME_END = 3,
}

export enum GameCode {
  SOLO_PRACTICE = "solo-practice",
  RANKED_MATCH = "ranked-match",
  HORSE_MATCH = "horse-match",
  SOLO_PIG = "solo-pig",
  KOTC_CHALLENGE = "kotc-challenge",
  TICKET_EVENT = "ticket-event",
  WAGER_MATCH = "wager-match",
}
// The logged in user
// GET/SET
export interface User {
  id: string;
  name: string;
  icon: string; // static icon for now, will have more options in future
  address: string; // crypto wallet/user id
  trophies: number; // medals/trophies/whetever
  tickets: number;
  tokens: number; // grabbed locally from metamask
}

// other users (public data)
// tickets and tokens don't need to be hidden but they don't need to be public either
export interface OtherPlayer {
  name: string;
  icon: string;
  address: string;
  trophies: number;
}

// local
export interface MatchResults {
  id: string;
  user: User; // new instance, shows trophy count at the time
  opponent?: OtherPlayer;
  userScore: number;
  opponentScore?: number;
  modeCode: string;
  tokenPrize?: number;
  trophyPrize?: number;
  ticketPrize?: number;
  userRecap: SessionRecap; // view the session again
  ticketCost: number;
  location?: string; // TODO: this
}

// public
export interface MatchPlayer {
  name: string;
  icon: string;
  address: string;
  trophies: string;
  score?: number;
}

// ----------------------------

export interface RawMatch {
  id: string; // game id
  mode_id: GameCode;
  time_end: number;
  players: {
    id: string; // user address
    score: number;
    scored: boolean;
    name: string;
    icon: string;
    trophies: number;
  }[];
  location?: LocationCoordinates;
  prize?: number;
}

export interface RawPlayer {
  id: string; // address
  name: string;
  icon: string;
  trophies: number;
}

export interface RawNotification {
  user_id: string;
  code: NotificationCode;
  data: RawMatch;
}

export interface RawGameRequest {
  id: string;
  requester: string;
  requestee: string;
  mode_id: GameCode;
  ticket_cost: number;
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export enum GameEvent {
  NO_EVENT = "no-event",
  TICKET_EVENT = "ticket-event",
}

export interface CourtLocation {
  name: string;
  coordinates: LocationCoordinates;
  owner_id: string;
  challenge_cost: number;
  event: GameEvent;
  image: string;
}

// ----------------------------

// Hide prizes so players use the same effort
// Hide scores until game end
// GET
export interface MatchInProgress {
  id: number; // sync with server
  opponent: OtherPlayer;
  userScore?: number;
  endDateTime: Date;
  mode: GameConfig;
  userRecap?: SessionRecap; // view the session again
  location?: string; // TODO: this
}
