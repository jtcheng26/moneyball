import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Camera,
  CameraDevice,
  useCameraDevices,
  useFrameProcessor,
  CameraDeviceFormat,
  VideoFile,
  PhotoFile,
} from "react-native-vision-camera";
import { useTailwind } from "tailwind-rn/dist";
import { yoloDetector } from "../../plugins/yoloDetector";
import "react-native-reanimated";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Svg, Rect, Circle } from "react-native-svg";
import { useOrientation } from "../../hooks/useOrientation";
import { FRAME_HEIGHT, FRAME_WIDTH } from "./constants";
import type { HoopDetection, BallDetection } from "./VisionCameraView.types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import useGameState, { GameState } from "../../hooks/useGameState";
import { OrientationLocker, UNLOCK } from "react-native-orientation-locker";

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedButton = Animated.createAnimatedComponent(Pressable);

let windowWidth = Dimensions.get("window").width;
let windowHeight = Dimensions.get("window").height;

if (windowHeight < windowWidth) {
  const temp = windowWidth;
  windowWidth = windowHeight;
  windowHeight = temp;
}

export const sortFormatsByResolution = (
  left: CameraDeviceFormat,
  right: CameraDeviceFormat
): number => {
  // in this case, points aren't "normalized" (e.g. higher resolution = 1 point, lower resolution = -1 points)
  let leftPoints = left.photoHeight * left.photoWidth;
  let rightPoints = right.photoHeight * right.photoWidth;

  // we also care about video dimensions, not only photo.
  leftPoints += left.videoWidth * left.videoHeight;
  rightPoints += right.videoWidth * right.videoHeight;

  // you can also add points for FPS, etc

  return rightPoints - leftPoints;
};

type VisionCameraViewProps = {
  children?: React.ReactNode;
  setScores: (scores: number[]) => void;
  gameState: GameState;
  updateGameState: (state: GameState) => void;
  active?: boolean;
  cameraFace: "FRONT" | "BACK";
  onRecordingFinished: (video: VideoFile) => void;
  onThumbnailCapture: (photo: PhotoFile) => void;
};

export default function VisionCameraView({
  children,
  setScores,
  active = false,
  gameState,
  updateGameState,
  cameraFace = "BACK",
  onRecordingFinished,
  onThumbnailCapture,
}: VisionCameraViewProps) {
  // const tailwind = useTailwind();
  const cam = useCameraDevices("wide-angle-camera");
  const camera = useRef<Camera>(null);
  const orientation = useOrientation();
  // const [device, setDevice] = useState<CameraDevice | undefined>();
  const device = useMemo(() => {
    if (cameraFace === "FRONT") {
      return cam.front;
    } else {
      return cam.back;
    }
  }, [cameraFace, cam]);
  const format = useMemo(() => {
    // photoheight and photowidth are landscape in formats
    if (device) {
      const formats = device.formats.sort(sortFormatsByResolution);
      return formats.filter(
        (f) => f.photoHeight === FRAME_WIDTH && f.photoWidth === FRAME_HEIGHT
      )[0];
    }

    return null;
  }, [device]);

  useEffect(() => {
    if (camera.current && gameState === "RUNNING") {
      camera.current.startRecording({
        onRecordingFinished: onRecordingFinished,
        onRecordingError: (error) => console.error(error),
      });
      (async () => {
        if (camera.current)
          onThumbnailCapture(
            await camera.current.takePhoto({ skipMetadata: true })
          );
      })();
    } else if (gameState === "FINISHED") {
      camera.current?.stopRecording();
    }
  }, [camera, gameState]);
  const hoopDetection = useSharedValue<HoopDetection | null>(null);
  const ballDetection = useSharedValue<BallDetection | null>(null);
  const updateHoop = useSharedValue(true);
  const shotState = useSharedValue("");
  const noShotFrames = useSharedValue(0);
  const detectedHoop = useSharedValue(false);
  const [camWidth, setCamWidth] = useState(windowWidth);
  const [camHeight, setCamHeight] = useState(windowHeight);
  const scores = useSharedValue([0, 0]);
  const gameStateShared = useSharedValue(gameState);
  useEffect(() => {
    gameStateShared.value = gameState;
  }, [gameState]);
  // const recordingStyles = useAnimatedStyle(() => {
  //   return {
  //     borderColor: !updateHoop.value ? "red" : "white",
  //     position: "absolute",
  //     padding: 30,
  //     borderRadius: 100,
  //     borderWidth: 10,
  //   };
  // });

  // function flipCamera() {
  //   if (device == back) {
  //     setDevice(front);
  //   } else {
  //     setDevice(back);
  //   }
  // }

  const rectProps = useAnimatedProps(() => {
    if (hoopDetection.value) {
      return {
        x:
          hoopDetection.value.box.x -
          (orientation === "PORTRAIT"
            ? (FRAME_WIDTH - (camWidth / camHeight) * FRAME_HEIGHT) / 2
            : 0),
        y:
          hoopDetection.value.box.y -
          (orientation === "LANDSCAPE"
            ? (FRAME_WIDTH - (camHeight / camWidth) * FRAME_HEIGHT) / 2
            : 0),
        width: hoopDetection.value.box.width,
        height: hoopDetection.value.box.height,
        fill: "rgba(0,0,255, 0)",
        strokeWidth: "10",
        stroke: "rgb(50, 100, 255)",
      };
    } else {
      return {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };
    }
  });

  const ballProps = useAnimatedProps(() => {
    if (ballDetection.value) {
      return {
        cx:
          ballDetection.value.box.cx -
          (orientation === "PORTRAIT"
            ? (FRAME_WIDTH - (camWidth / camHeight) * FRAME_HEIGHT) / 2
            : 0),
        cy:
          ballDetection.value.box.cy -
          (orientation === "LANDSCAPE"
            ? (FRAME_WIDTH - (camHeight / camWidth) * FRAME_HEIGHT) / 2
            : 0),
        r: ballDetection.value.box.radius,
        fill: "rgba(0,0,0, 0)",
        strokeWidth: "10",
        stroke: "rgba(255, 100, 50, 1)",
        strokeOpacity: withTiming(ballDetection.value.opacity, {
          duration: 250,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
      };
    } else {
      return {
        cx: 0,
        cy: 0,
        r: 0,
        strokeOpacity: 0,
      };
    }
  });

  useEffect(() => {
    if (gameState === "RUNNING" && detectedHoop) {
      updateHoop.value = false;
    } else if (gameState === "PREPARING") {
      updateHoop.value = true;
    }
  }, [gameState]);

  const frameProcessor = useFrameProcessor((frame) => {
    "worklet";
    console.log(updateHoop.value, gameStateShared.value);
    const st = Date.now();
    const detectionsRes = yoloDetector(
      frame,
      updateHoop.value && gameStateShared.value !== "RUNNING"
    );
    console.log(detectionsRes);
    if (detectionsRes.length >= 5) {
      console.log("hooping");
      // updateHoop.value = false;
      const l = detectionsRes[detectionsRes.length - 1 - 3];
      const t = detectionsRes[detectionsRes.length - 1 - 2];
      const r = detectionsRes[detectionsRes.length - 1 - 1];
      const b = detectionsRes[detectionsRes.length - 1];
      hoopDetection.value = {
        box: {
          x: l,
          y: t,
          width: r - l,
          height: b - t,
        },
      };
      if (!detectedHoop.value) runOnJS(updateGameState)("READY");
      detectedHoop.value = true;
    } else if (detectionsRes.length >= 4) {
      ballDetection.value = {
        box: {
          cx: detectionsRes[1],
          cy: detectionsRes[2],
          radius: detectionsRes[3],
        },
        opacity: 1,
      };
    } else {
      if (noShotFrames.value < 10) noShotFrames.value += 1;
      if (noShotFrames.value == 10) {
        shotState.value = "";
        // noShotFrames.value = 0;
        ballDetection.value = {
          box: {
            cx: ballDetection.value?.box.cx || 0,
            cy: ballDetection.value?.box.cy || 0,
            radius: ballDetection.value?.box.radius || 0,
          },
          opacity: 0,
        };
      }
    }

    if (detectionsRes[0] === 1) {
      shotState.value = "Score";
      noShotFrames.value = 0;
      runOnJS(setScores)([scores.value[0] + 1, scores.value[1]]);
      scores.value = [scores.value[0] + 1, scores.value[1]];
    } else if (detectionsRes[0] == -1) {
      shotState.value = "Miss";
      noShotFrames.value = 0;
      runOnJS(setScores)([scores.value[0], scores.value[1] + 1]);
      scores.value = [scores.value[0], scores.value[1] + 1];
    }

    console.log(Date.now() - st);
  }, []);

  return (
    <View>
      {/* <SafeAreaView
        style={{ backgroundColor: "black" }}
        edges={
          orientation === "PORTRAIT" ? ["top", "bottom"] : ["left", "right"]
        }
      > */}
      <StatusBar barStyle="light-content" />
      {device && format ? (
        <View>
          <View
            style={[
              cameraStyles.cameraContainer,
              {
                height: "100%",
                // height:
                //   orientation === "PORTRAIT"
                //     ? (windowWidth * FRAME_HEIGHT) / FRAME_WIDTH
                //     : "100%",
                width: "100%",
                // width:
                //   orientation === "PORTRAIT"
                //     ? "100%"
                //     : (windowWidth * FRAME_HEIGHT) / FRAME_WIDTH,
                backgroundColor: "black",
              },
            ]}
          >
            <Camera
              ref={camera}
              video={true}
              photo={true}
              style={cameraStyles.camera}
              device={device}
              isActive={active}
              frameProcessor={frameProcessor}
              frameProcessorFps={gameState !== "RUNNING" ? 2 : 50}
              enableZoomGesture={true}
              format={format}
            >
              <View
                style={[
                  cameraStyles.overlay,
                  {
                    height: "100%",
                    // height:
                    //   orientation === "PORTRAIT"
                    //     ? (windowWidth * FRAME_HEIGHT) / FRAME_WIDTH
                    //     : "100%",
                    width: "100%",
                    // width:
                    //   orientation === "PORTRAIT"
                    //     ? "100%"
                    //     : (windowWidth * FRAME_HEIGHT) / FRAME_WIDTH,
                  },
                ]}
                onLayout={(event) => {
                  var { x, y, width, height } = event.nativeEvent.layout;
                  setCamWidth(width);
                  setCamHeight(height);
                  console.log(width, height);
                }}
              >
                {children}
                <Svg
                  style={StyleSheet.absoluteFill}
                  viewBox={`0 0 ${
                    orientation === "PORTRAIT"
                      ? (camWidth / camHeight) * FRAME_HEIGHT
                      : FRAME_HEIGHT
                  } ${
                    orientation === "LANDSCAPE"
                      ? (camHeight / camWidth) * FRAME_HEIGHT
                      : FRAME_HEIGHT
                  }`}
                >
                  <AnimatedRect animatedProps={rectProps} />
                  <AnimatedCircle animatedProps={ballProps} />
                </Svg>
                {/* <AnimatedButton
                  onPress={() => {
                    if (updateHoop.value) updateGameState("RUNNING");
                    else updateGameState("FINISHED");
                    if (detectedHoop) updateHoop.value = !updateHoop.value;
                  }}
                  style={[
                    recordingStyles,
                    {
                      right: orientation === "LANDSCAPE" ? 20 : "auto",
                      bottom: orientation === "PORTRAIT" ? 20 : "auto",
                    },
                  ]}
                /> */}
              </View>
            </Camera>
          </View>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
      {/* </SafeAreaView> */}
      {/* <View
        style={
          orientation === "LANDSCAPE" ? barStyles.sidebar : { display: "none" }
        }
      >
        <Pressable onPress={flipCamera} style={cameraStyles.button}>
          <Text style={tailwind("text-xl text-white font-bold")}>Flip</Text>
        </Pressable>
      </View> */}
    </View>
  );
}

const barStyles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    right: 0,
    display: "flex",
    height: "100%",
    width: 90,
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
  },
});

const cameraStyles = StyleSheet.create({
  camera: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    zIndex: 1,
    borderWidth: 0,
    borderColor: "black",
    borderRadius: 15,
    // display: "flex",
    // justifyContent: "center",
    // alignItems: "center",
  },
  cameraContainer: {
    // display: "flex",
    // flexDirection: "column",
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "#fff",
  },
  overlay: {
    zIndex: 2,
    width: "100%",
    backgroundColor: "transparent",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonView: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 40,
    display: "flex",
    flexDirection: "column",
  },
  button: {
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowColor: "black",
    shadowOpacity: 0.4,
    backgroundColor: "#f64",
    borderRadius: 10,
    margin: 5,
    padding: 10,
  },
  recordButton: {
    position: "absolute",
    padding: 30,
    borderRadius: 100,
    borderWidth: 10,
  },
  statusView: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(40, 40, 40)",
    borderRadius: 10,
    margin: 20,
  },
});
