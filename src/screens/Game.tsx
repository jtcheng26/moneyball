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
// import RecordScreen from "react-native-record-screen";

type Props = {
  modeConfig: GameConfig;
  endSession: () => void;
  active: boolean;
};

const Game = ({ active, modeConfig, endSession }: Props) => {
  const [scoreGreen, setScoreGreen] = useState(0);
  const [scoreRed, setScoreRed] = useState(0);
  const [sessionInfo, setSessionInfo] = useState<SessionRecap | null>(null);
  const [gameState, setGameState] = useState<GameState>("PREPARING");
  const [camState, setCamState] = useState<"FRONT" | "BACK">("FRONT");
  const [showExitDialog, setShowExitDialog] = useState(false);

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
    setTimeout(() => {
      setSessionInfo(sessionInfo);
    }, 400);

    // endSession();
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
  function onRecordingFinished(video: VideoFile) {
    setVideo(video);
    CameraRoll.save(video.path, { type: "video" });
    console.log(video.path);
  }
  function onThumbnailCapture(photo: PhotoFile) {
    setThumbnail(photo);
    console.log(photo.path);
  }

  return (
    <>
      <Modal
        style={{ margin: 0 }}
        supportedOrientations={["portrait", "landscape"]}
        isVisible={active}
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
                  <View style={{ height: 10 }} />
                  <StandardIconButton
                    icon="CameraFlip"
                    color={THEME_COLORS.theme[50]}
                    iconColor={THEME_COLORS.dark[800]}
                    onPress={flipCamera}
                  />
                </View>
                <modeConfig.controller
                  gameState={gameState as GameState}
                  updateGameState={updateGameState}
                  greenScore={scoreGreen}
                  redScore={scoreRed}
                  endSession={finishGame}
                  orientation={orientation}
                />
              </SafeAreaView>
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
            onConfirm={endSession}
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
                }, 300);
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
});
