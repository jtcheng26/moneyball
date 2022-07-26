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
  function playGame(fee?: number) {
    closeModal();
    if (gameConfig.numPlayers == 1) startGame(gameConfig);
    else {
      onMatching(gameConfig.id, fee);
    }
  }

  function onPressPlay(config: GameConfig) {
    setGameConfig(config);
    showModalAnim("play");
  }
  function onPressActive(config: GameConfig, game?: RawMatch) {
    setGameConfig(config);
    setActiveGame(game);
    showModalAnim("active");
  }
  function onPressRecent(config: GameConfig, game: MatchResults) {
    setGameConfig(config);
    setRecapGame(game);
    showModalAnim("recent");
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
  useEffect(() => {
    setTimeout(() => {
      setShowNotif(true);
    }, 3000);
  }, []);
  async function refetchAll() {
    refetch();
    refetchRecent();
    // await Promise.all([refetchTix(), refetchTrophies(), refetchTokens()]);
    // refetchUser();
  }
  const cb = useCallback(() => {
    if (auth) {
      refetchAll();
    }
  }, [auth]);
  useRefetchOnFocus(cb);

  const startGame = useCallback(
    (config: GameConfig, activeGame?: RawMatch) => {
      setShowModal(false);
      setGameConfig(config);
      setActiveGame(activeGame);
      setTimeout(() => {
        setAnimateClose(true);
        setGame(true);
      }, 700);
    },
    [activeGame]
  );

  function endGame(gameID: string = "") {
    setShowNotif(false);
    setAnimateClose(false);
    setTimeout(() => {
      setShowNotif(true);
      refetch();
      setGame(false);
      refetchRecent();
    }, 400);
    // reload stuff
  }

  const [showNotif, setShowNotif] = useState(false);
  function showModalAnim(t: "active" | "play" | "recent") {
    setShowNotif(false);
    setShowModal(t);
  }

  function closeModal() {
    setShowModal(false);
    setTimeout(() => {
      setShowNotif(true);
    }, 500);
  }

  const scrollRef = useRef();
  const [wagerFee, setWagerFee] = useState(0);

  const onMatching = useCallback(
    (code: GameCode, fee?: number) => {
      if (fee) setWagerFee(fee);
      // ------------
      // send request here
      startMatching(
        code,
        code === GameCode.RANKED_MATCH
          ? configFromCode[code].entryFee
          : fee
          ? fee
          : 50
      );
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

  const onMatchFound = useCallback(
    (match: RawMatch, notifType: NotificationCode) => {
      setPendingGames([]); // TODO: delete the actual pending game instead of all
      refetch();
      if (notifType === NotificationCode.GAME_START) {
        if (match.mode_id === GameCode.WAGER_MATCH) {
          upd({ tix: -1 * wagerFee });
        } else {
          upd({ tix: -50 }); // temp
        }
      } else if (notifType === NotificationCode.GAME_END) {
        const p =
          match.players[0].id.toLowerCase() === conn.accounts[0].toLowerCase()
            ? 0
            : 1;
        const o = p === 0 ? 1 : 0;
        if (match.players[p].score > match.players[o].score) {
          if (match.mode_id === GameCode.RANKED_MATCH) upd({ trophies: 100 });
          else if (match.mode_id === GameCode.HORSE_MATCH) upd({ tokens: 600 });
          else if (match.mode_id === GameCode.WAGER_MATCH)
            upd({ tokens: match.prize ? match.prize : 0 });
        } else if (match.players[p].score === match.players[o].score)
          upd({ tix: 50 });
      }

      if (notifType === NotificationCode.GAME_END) {
        let x = 0;
        const rec = setTimeout(() => {
          refetchRecent();
          // x++;
          // if (x == 5) clearInterval(rec);
        }, 2000);
      }
    },
    [upd, wagerFee]
  );

  return (
    <>
      <MatchFoundNotifHandler
        onNotif={onMatchFound}
        startGame={startGame}
        modalReady={showNotif}
        showRecent={(config: GameConfig, result: MatchResults) => {
          setTimeout(() => {
            onPressRecent(config, result);
          }, 400);
        }}
      />
      <DarkenedModal visible={showModal === "play"} onDismiss={closeModal}>
        <GameConfirmDialog
          title={gameConfig.name}
          body={gameConfig.description}
          entryFee={gameConfig.entryFee}
          onCancel={closeModal}
          onConfirm={playGame}
          disabled={(!tix && tix !== 0) || tix < gameConfig.entryFee}
          wager={gameConfig.id === GameCode.WAGER_MATCH}
        />
      </DarkenedModal>
      <DarkenedModal visible={showModal === "active"} onDismiss={closeModal}>
        {!!activeGame && (
          <ActiveGameDialog
            userID={conn.accounts[0]}
            game={activeGame}
            config={gameConfig}
            onCancel={closeModal}
            onConfirm={startGame}
            bannerText={gameConfig.name}
          />
        )}
      </DarkenedModal>
      <DarkenedModal
        visible={showModal === "recent"}
        onDismiss={closeModal}
        noPadding
      >
        {!!recapGame && (
          <SessionRecapScreen
            recap={recapGame.userRecap}
            modeConfig={gameConfig}
            onConfirm={closeModal}
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
