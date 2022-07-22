import { StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import VisionCameraView from "../components/camera-view/VisionCameraView";
import { SessionRecap } from "../components/game-controllers/SoloPracticeController";
import { GameConfig } from "../configs/gameConfig.types";
import Orientation, {
  LANDSCAPE,
  OrientationLocker,
  OrientationType,
  UNLOCK,
} from "react-native-orientation-locker";
import useGameState, { GameState } from "../hooks/useGameState";
import { SafeAreaView } from "react-native-safe-area-context";
import CancelButton from "../components/lib/buttons/CancelButton";
import ConfirmationDialog from "../components/lib/dialogs/ConfirmationDialog";
import DarkenedModal from "../components/lib/dialogs/DarkenedModal";
import { THEME_COLORS } from "../theme";
import IconButton from "../components/lib/buttons/icon-button/IconButton";
import StandardIconButton from "../components/lib/buttons/StandardIconButton";
import { PhotoFile, VideoFile } from "react-native-vision-camera";
import CameraRoll from "@react-native-community/cameraroll";
import SessionRecapScreen from "./SessionRecap";
import Modal from "react-native-modal";
import saveGame, { saveSessionContent } from "../data/saveGame";
import useUserData from "../hooks/useUserData";
import { GameCode, MatchResults, RawMatch } from "../data/data.types";
import sendSession from "../hooks/api/score";
import LabelText from "../components/lib/text/LabelText";
// import RecordScreen from "react-native-record-screen";

type Props = {
  modeConfig: GameConfig;
  endSession: (recap?: SessionRecap) => void;
  active: boolean;
  game?: RawMatch;
  location?: string;
};

const Game = ({ active, modeConfig, endSession, game, location }: Props) => {
  const [scoreGreen, setScoreGreen] = useState(0);
  const [scoreRed, setScoreRed] = useState(0);
  const [sessionInfo, setSessionInfo] = useState<SessionRecap | null>(null);
  const [gameState, setGameState] = useState<GameState>("PREPARING");
  const [camState, setCamState] = useState<"FRONT" | "BACK">("FRONT");
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [countdown, setCountdown] = useState(-1);

  useEffect(() => {
    if (gameState === "STARTING") {
      if (countdown === -1) setCountdown(5);
      const interval = setInterval(() => {
        if (countdown === 0) {
          updateGameState("RUNNING");
          setCountdown(-1);
          clearInterval(interval);
        } else if (countdown > 0) {
          setCountdown(countdown - 1);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [countdown, setCountdown, gameState]);

  // RecordScreen.setup({ mic: false });

  const setScores = useCallback(
    (scores: number[]) => {
      setScoreGreen(scores[0]);
      setScoreRed(scores[1]);
    },
    [setScoreGreen, setScoreRed]
  );

  const updateGameState = useCallback(
    (state: GameState) => {
      setGameState(state);
    },
    [setGameState]
  );

  function finishGame(sessionInfo: SessionRecap) {
    console.log(sessionInfo);
    // --------------------------------
    // TODO:
    // send scores to server here
    if (game) {
      sendSession(scoreGreen, game.id);
    }
    // --------------------------------
    setTimeout(() => {
      setSessionInfo(sessionInfo);
    }, 400);

    // endSession();
  }

  function finishSessionRecap() {
    setTimeout(() => {
      endSession(sessionInfo ? sessionInfo : undefined);
    }, 400);
  }

  function flipCamera() {
    setCamState(camState === "FRONT" ? "BACK" : "FRONT");
  }

  function dialogBody(gameState: GameState) {
    if (gameState !== "RUNNING") return "You will return to the menu.";
    else if (modeConfig.countEarlyStop)
      return "You will NOT be able to resume or restart.";
    else return "You will lose all progress and will NOT be able to restart.";
  }

  const [orientation, setOrientation] = useState<OrientationType>("PORTRAIT");
  useEffect(() => {
    const listener = (o: OrientationType) => {
      setOrientation(o);
    };
    Orientation.addOrientationListener(listener);

    return () => Orientation.removeOrientationListener(listener);
  }, []);

  function UILocationStyles(orientation: OrientationType) {
    if (orientation === "LANDSCAPE-LEFT") {
      return {
        alignItems: "flex-end",
        paddingRight: "5%",
      };
    } else {
      return {
        alignItems: "baseline",
        paddingLeft: "5%",
      };
    }
  }

  const [video, setVideo] = useState<VideoFile>();
  const [thumbnail, setThumbnail] = useState<PhotoFile>();
  const { data: user } = useUserData();
  function onRecordingFinished(video: VideoFile) {
    setVideo(video);
    console.log(video.path);
  }
  function onThumbnailCapture(photo: PhotoFile) {
    setThumbnail(photo);
    console.log(photo.path);
  }

  useEffect(() => {
    if (sessionInfo) {
      sessionInfo.video = video?.path;
      sessionInfo.thumbnail = "file://" + thumbnail?.path;
      if (modeConfig.numPlayers === 1) {
        saveGame({
          id: "0",
          user: user,
          userScore: scoreGreen,
          modeCode: modeConfig.id,
          ticketCost: modeConfig.entryFee,
          userRecap: sessionInfo,
        } as MatchResults);
      } else if (game && user)
        saveSessionContent(game.id, user.id, sessionInfo);
    }
  }, [sessionInfo]);

  return (
    <>
      <Modal
        style={{ margin: 0 }}
        supportedOrientations={["portrait", "landscape"]}
        isVisible={active}
        useNativeDriver
        hideModalContentWhileAnimating
      >
        <View>
          <>
            <OrientationLocker orientation={UNLOCK} />
            <VisionCameraView
              setScores={setScores}
              active={active && sessionInfo === null}
              gameState={gameState as GameState}
              updateGameState={updateGameState}
              cameraFace={camState}
              onRecordingFinished={onRecordingFinished}
              onThumbnailCapture={onThumbnailCapture}
            >
              <SafeAreaView style={styles.container}>
                <View style={[UILocationStyles(orientation), styles.buttons]}>
                  <CancelButton
                    onCancel={() => setShowExitDialog(true)}
                    color={
                      gameState === "RUNNING"
                        ? THEME_COLORS.red[500]
                        : undefined
                    }
                  />
                  {gameState !== "RUNNING" && (
                    <>
                      <View style={{ height: 10 }} />
                      <StandardIconButton
                        icon="CameraFlip"
                        color={THEME_COLORS.theme[50]}
                        iconColor={THEME_COLORS.dark[800]}
                        onPress={flipCamera}
                      />
                    </>
                  )}

                  {/* <View style={styles.timer}>
                    <LabelText text={countdown} size={80} />
                  </View> */}
                </View>
                <modeConfig.controller
                  gameState={gameState as GameState}
                  updateGameState={updateGameState}
                  greenScore={scoreGreen}
                  redScore={scoreRed}
                  endSession={finishGame}
                  orientation={orientation}
                  location={location}
                />
              </SafeAreaView>
              {countdown >= 0 && (
                <View style={styles.timerContainer} pointerEvents="box-none">
                  <View style={styles.timer}>
                    <LabelText text={countdown} size={50} />
                  </View>
                </View>
              )}
            </VisionCameraView>
          </>
        </View>
        <Modal
          isVisible={active && !!sessionInfo}
          coverScreen
          style={{ margin: 0 }}
        >
          <SessionRecapScreen
            recap={sessionInfo}
            modeConfig={modeConfig}
            video={video?.path}
            thumbnail={"file://" + thumbnail?.path}
            onConfirm={finishSessionRecap}
          />
        </Modal>
        <DarkenedModal
          allOrientations
          visible={active && showExitDialog}
          onDismiss={() => setShowExitDialog(false)}
        >
          <ConfirmationDialog
            title="Exit session?"
            body={dialogBody(gameState as GameState)}
            onCancel={() => setShowExitDialog(false)}
            onConfirm={() => {
              setShowExitDialog(false);
              if (gameState === "RUNNING" && modeConfig.countEarlyStop) {
                updateGameState("FINISHED");
              } else {
                setTimeout(() => {
                  endSession();
                }, 400);
              }
            }}
          />
        </DarkenedModal>
      </Modal>
    </>
  );
};

export default Game;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  buttons: {
    // position: "absolute",
    top: "5%",
    display: "flex",
    flexDirection: "column",
  },

  timerContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  timer: {
    width: 100,
    height: 100,
    backgroundColor: THEME_COLORS.red[500].color,
    borderBottomWidth: 8,
    borderBottomColor: THEME_COLORS.red[500].underline,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
});
