import AsyncStorage from "@react-native-async-storage/async-storage";
import { SessionRecap } from "../components/game-controllers/SoloPracticeController";
import type { MatchResults, RawMatch } from "./data.types";

export async function recentGames(userID: string) {
  let games = await AsyncStorage.getItem(
    "EAGLE_RECENT_GAMES_" + userID.toLowerCase()
  );
  if (!games) {
    games = "[]";
  }

  const curr = JSON.parse(games) as MatchResults[];
  return curr;
}

export async function saveSessionContent(
  id: string,
  userID: string,
  session: SessionRecap
) {
  await AsyncStorage.setItem(
    "EAGLE_SESSION_DATA_" + id + "_" + userID.toLowerCase(),
    JSON.stringify({
      id: id,
      session: session,
    })
  );
}

export async function getSessionContent(id: string, userID: string) {
  return await AsyncStorage.getItem(
    "EAGLE_SESSION_DATA_" + id + "_" + userID.toLowerCase()
  );
}

export async function saveRawMatch(game: RawMatch, userID: string) {
  const user = game.players.filter((p) => p.id === userID.toLowerCase())[0];
  const opp = game.players.filter((p) => p.id !== userID.toLowerCase())[0];

  const recap = JSON.parse(
    (await getSessionContent(game.id, userID)) ||
      `{
    "id": 0,
    "session": {
      "make": 0,
      "miss": 0,
      "time": 300,
      "video": "",
      "thumbnail": "",
      "mode": "ranked-match"
    }
  }`
  ) as {
    id: string;
    session: SessionRecap;
  };
  const result: MatchResults = {
    id: game.id,
    user: {
      id: user.id,
      name: user.name,
      icon: user.icon,
      address: user.id,
      trophies: user.trophies,
      tickets: 0,
      tokens: 0,
    },
    opponent: {
      name: opp.name,
      icon: opp.icon,
      address: opp.id,
      trophies: opp.trophies,
    },
    opponentScore: opp.score,
    userScore: user.score,
    modeCode: game.mode_id,
    ticketCost: 100,
    userRecap: recap.session,
    trophyPrize: 100,
  };

  saveGame(result);
  return result;
}

export default async function saveGame(game: MatchResults) {
  let games = await recentGames(game.user.id);
  if (games.length >= 10) {
    games = games.slice(games.length - 9, games.length);
  }

  games.push(game);

  AsyncStorage.setItem(
    "EAGLE_RECENT_GAMES_" + game.user.id.toLowerCase(),
    JSON.stringify(games)
  );
}
