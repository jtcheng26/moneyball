import { View, Text, ScrollView, StyleSheet, StatusBar } from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTailwind } from "tailwind-rn/dist";
import { THEME_COLORS } from "../theme";
import { SoloPracticeConfig } from "../configs/soloPracticeConfig";
import { OrientationLocker } from "react-native-orientation-locker";
import { configFromCode, GameConfig } from "../configs/gameConfig.types";
import Game from "./Game";
import FadeHeader from "../components/lib/spacing/FadeHeader";
import TokenButton from "../components/currency-button/TokenButton";
import TicketButton from "../components/currency-button/TicketButton";
import ProfilePill from "../components/profile/ProfilePill";
import PlayCarousel from "../components/carousels/PlayCarousel";
import useUserData from "../hooks/useUserData";
import {
  GameCode,
  MatchInProgress,
  MatchResults,
  NotificationCode,
  RawMatch,
} from "../data/data.types";
import { recentGames } from "../data/saveGame";
import RecentCarousel from "../components/carousels/RecentCarousel";
import ActiveCarousel from "../components/carousels/ActiveCarousel";
import useActiveGames from "../hooks/useActiveGames";
import useNotifs from "../hooks/useNotifs";
import { useRefetchOnFocus } from "../hooks/useRefetchOnFocus";
import useTickets from "../hooks/useTickets";
import useTrophies from "../hooks/useTrophies";
import useTokens from "../hooks/useTokens";
import useAuth from "../hooks/useAuth";
import DarkenedModal from "../components/lib/dialogs/DarkenedModal";
import GameConfirmDialog from "../components/lib/dialogs/GameConfirmDialog";
import MatchFoundNotifHandler from "../components/notification-handlers/MatchFoundNotifHandler";
import startMatching from "../hooks/api/match";
import ActiveGameDialog from "../components/lib/dialogs/ActiveGameDialog";
import FinishedGameDialog from "../components/lib/dialogs/FinishedGameDialog";
import SessionRecapScreen from "./SessionRecap";
import ScreenWithHeaders from "./ScreenWithHeaders";
import ScrollScreen from "../components/lib/spacing/ScrollScreen";
import useRecentGames from "../hooks/useRecentGames";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import useVisualCurrency from "../hooks/useVisual";

export default function Play() {
  const tw = useTailwind();
  const [game, setGame] = useState(false);
  const [animateClose, setAnimateClose] = useState(true);
  const [gameConfig, setGameConfig] = useState<GameConfig>(SoloPracticeConfig);
  const [showModal, setShowModal] = useState<
    false | "active" | "play" | "recent"
  >(false);
  const [matching, setMatching] = useState(false);
  const [recapGame, setRecapGame] = useState<MatchResults>();
  function playGame() {
    setShowModal(false);
    if (gameConfig.numPlayers == 1) startGame(gameConfig);
    else {
      onMatching(gameConfig.id);
    }
  }

  function onPressPlay(config: GameConfig) {
    setGameConfig(config);
    setShowModal("play");
  }
  function onPressActive(config: GameConfig, game?: RawMatch) {
    setGameConfig(config);
    setActiveGame(game);
    setShowModal("active");
  }
  function onPressRecent(config: GameConfig, game: MatchResults) {
    setGameConfig(config);
    setRecapGame(game);
    setShowModal("recent");
  }
  const conn = useWalletConnect();
  const { data: user, isSuccess, refetch: refetchUser } = useUserData();
  const [activeGame, setActiveGame] = useState<RawMatch | null>();
  const [pendingGames, setPendingGames] = useState<GameCode[]>([]);
  // const [pastGames, setPastGames] = useState<MatchResults[]>();
  const { data: auth } = useAuth();
  const {
    data: pastGames,
    isSuccess: pastGamesSuccess,
    refetch: refetchRecent,
  } = useRecentGames(conn.accounts[0]);
  const {
    data: activeGames,
    isSuccess: activeGamesSuccess,
    refetch,
  } = useActiveGames();
  const activeNoKOTC = useMemo(() => {
    if (activeGames && activeGames.length) {
      return activeGames.filter(
        (game) => game.mode_id !== GameCode.KOTC_CHALLENGE
      );
    }

    return [];
  }, [activeGames]);
  const { tix, upd } = useVisualCurrency();
  async function refetchAll() {
    refetch();
    refetchRecent();
    // await Promise.all([refetchTix(), refetchTrophies(), refetchTokens()]);
    refetchUser();
  }
  const cb = useCallback(() => {
    if (auth) {
      refetchAll();
    }
  }, [auth]);
  useRefetchOnFocus(cb);

  function startGame(config: GameConfig, activeGame?: RawMatch) {
    setShowModal(false);
    setGameConfig(config);
    setActiveGame(activeGame);
    setTimeout(() => {
      setAnimateClose(true);
      setGame(true);
    }, 500);
  }

  function endGame(gameID: string = "") {
    setAnimateClose(false);
    setTimeout(() => {
      refetch();
      setGame(false);
      refetchRecent();
    }, 400);
    // reload stuff
  }

  const scrollRef = useRef();

  const onMatching = useCallback(
    (code: GameCode) => {
      // ------------
      // send request here
      startMatching(code, configFromCode[code].entryFee);
      // ------------
      if (scrollRef.current) {
        setPendingGames([code].concat(pendingGames));
        setMatching(true);
        scrollRef.current.scrollTo({
          y: 0,
          animated: true,
        });
      } else {
        setTimeout(() => onMatching(code), 50);
      }
    },
    [scrollRef, pendingGames]
  );

  function onMatchFound(match: RawMatch, notifType: NotificationCode) {
    setPendingGames([]); // TODO: delete the actual pending game instead of all
    refetch();
    if (notifType === NotificationCode.GAME_START) upd({ tix: -50 }); // temp
    else if (notifType === NotificationCode.GAME_END) {
      const p =
        match.players[0].id.toLowerCase() === conn.accounts[0].toLowerCase()
          ? 0
          : 1;
      const o = p === 0 ? 1 : 0;
      if (match.players[p].score > match.players[o].score)
        upd({ trophies: 100 });
      else if (match.players[p].score === match.players[o].score)
        upd({ tix: 50 });
    }

    if (notifType === NotificationCode.GAME_END) {
      let x = 0;
      const rec = setInterval(() => {
        refetchRecent();
        x++;
        if (x == 5) clearInterval(rec);
      }, 1000);
    }
  }

  return (
    <>
      <MatchFoundNotifHandler
        onNotif={onMatchFound}
        startGame={startGame}
        modalReady={!showModal}
        showRecent={(config: GameConfig, result: MatchResults) => {
          setTimeout(() => {
            onPressRecent(config, result);
          }, 400);
        }}
      />
      <DarkenedModal
        visible={showModal === "play"}
        onDismiss={() => setShowModal(false)}
      >
        <GameConfirmDialog
          title={gameConfig.name}
          body={gameConfig.description}
          entryFee={gameConfig.entryFee}
          onCancel={() => setShowModal(false)}
          onConfirm={playGame}
          disabled={!tix || tix < gameConfig.entryFee}
        />
      </DarkenedModal>
      <DarkenedModal
        visible={showModal === "active"}
        onDismiss={() => setShowModal(false)}
      >
        {!!activeGame && (
          <ActiveGameDialog
            userID={conn.accounts[0]}
            game={activeGame}
            config={gameConfig}
            onCancel={() => setShowModal(false)}
            onConfirm={startGame}
            bannerText={gameConfig.name}
          />
        )}
      </DarkenedModal>
      <DarkenedModal
        visible={showModal === "active"}
        onDismiss={() => setShowModal(false)}
      >
        {!!activeGame && (
          <ActiveGameDialog
            userID={conn.accounts[0]}
            game={activeGame}
            config={gameConfig}
            onCancel={() => setShowModal(false)}
            onConfirm={startGame}
            bannerText={gameConfig.name}
          />
        )}
      </DarkenedModal>
      <DarkenedModal
        visible={showModal === "recent"}
        onDismiss={() => setShowModal(false)}
        noPadding
      >
        {!!recapGame && (
          <SessionRecapScreen
            recap={recapGame.userRecap}
            modeConfig={gameConfig}
            onConfirm={() => setShowModal(false)}
            video={recapGame.userRecap.video}
            thumbnail={recapGame.userRecap.thumbnail}
          />
        )}
      </DarkenedModal>
      <ScreenWithHeaders>
        <ScrollScreen rf={scrollRef}>
          {(activeNoKOTC.length > 0 || pendingGames.length > 0) && (
            <View style={styles.section}>
              <ActiveCarousel
                games={
                  activeGames ? pendingGames.concat(activeNoKOTC) : pendingGames
                }
                onPress={onPressActive}
                startGame={startGame}
                userID={conn.accounts[0]}
              />
            </View>
          )}
          <View style={styles.section}>
            <PlayCarousel onPress={onPressPlay} />
          </View>
          {pastGames && pastGames.length > 0 && (
            <View style={styles.section}>
              <RecentCarousel games={pastGames} onPress={onPressRecent} />
            </View>
          )}
        </ScrollScreen>

        {game && (
          <Game
            game={
              activeGame && gameConfig.numPlayers > 1 ? activeGame : undefined
            }
            active={animateClose}
            modeConfig={gameConfig}
            endSession={endGame}
          />
        )}
      </ScreenWithHeaders>
    </>
  );
}

const styles = StyleSheet.create({
  translucentBar: {
    backgroundColor: "#062231EE",
    position: "absolute",
    top: 0,
    height: 50,
    width: "100%",
    zIndex: 100,
  },
  section: {
    marginTop: 60,
  },
});
