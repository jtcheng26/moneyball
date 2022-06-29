import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Camera,
  CameraDevice,
  useCameraDevices,
  useFrameProcessor,
  CameraDeviceFormat,
} from "react-native-vision-camera";
import { useTailwind } from "tailwind-rn/dist";
import { yoloDetector } from "../../plugins/yoloDetector";
import "react-native-reanimated";
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Svg, Rect, Circle } from "react-native-svg";
import { ReText } from "react-native-redash";
import { useOrientation } from "../../hooks/useOrientation";
import { FRAME_HEIGHT, FRAME_WIDTH } from "./constants";
import type { HoopDetection, BallDetection } from "./VisionCameraView.types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

let windowWidth = Dimensions.get("window").width;
let windowHeight = Dimensions.get("window").height;

if (windowHeight < windowWidth) {
  const temp = windowWidth;
  windowWidth = windowHeight;
  windowHeight = temp;
}

// function getMaxFps(format: CameraDeviceFormat): number {
//   return format.frameRateRanges.reduce((prev, curr) => {
//     if (curr.maxFrameRate > prev) return curr.maxFrameRate;
//     else return prev;
//   }, 0);
// }

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

export default function VisionCameraView() {
  const tailwind = useTailwind();
  const cam = useCameraDevices("wide-angle-camera");
  const orientation = useOrientation();
  // useEffect(() => {
  //   if (orientation === "PORTRAIT") {
  //     windowWidth = Dimensions.get("window").width;
  //     windowHeight = Dimensions.get("window").height;
  //   } else {
  //     windowWidth = Dimensions.get("window").height;
  //     windowHeight = Dimensions.get("window").width;
  //   }
  // });
  const [device, setDevice] = useState<CameraDevice | undefined>();
  const formats = useMemo(
    () => device?.formats.sort(sortFormatsByResolution),
    [device?.formats]
  );
  const back = useMemo(() => {
    if (cam) return cam.back;
  }, [cam]);
  const front = useMemo(() => {
    if (cam) return cam.front;
  }, [cam]);
  useEffect(() => {
    if (cam && !device) setDevice(back);
  });
  const hoopDetection = useSharedValue<HoopDetection | null>(null);
  const ballDetection = useSharedValue<BallDetection | null>(null);
  const updateHoop = useSharedValue(true);
  const shotState = useSharedValue("");
  const noShotFrames = useSharedValue(0);
  const detectedHoop = useSharedValue(false);

  const shotStateContainerStyles = useAnimatedStyle(() => {
    return {
      display: shotState.value === "" ? "none" : "flex",
    };
  });

  function flipCamera() {
    if (device == back) {
      setDevice(front);
    } else {
      setDevice(back);
    }
  }

  const rectProps = useAnimatedProps(() => {
    if (hoopDetection.value) {
      return {
        x: hoopDetection.value.box.x,
        y: hoopDetection.value.box.y,
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
        cx: ballDetection.value.box.cx,
        cy: ballDetection.value.box.cy,
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

  const frameProcessor = useFrameProcessor((frame) => {
    "worklet";
    const st = Date.now();
    const detectionsRes = yoloDetector(frame, updateHoop.value);
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
      if (noShotFrames.value < 20) noShotFrames.value += 1;
      if (noShotFrames.value == 20) {
        shotState.value = "";
        noShotFrames.value = 0;
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
    } else if (detectionsRes[0] == -1) {
      shotState.value = "Miss";
      noShotFrames.value = 0;
    }

    console.log(Date.now() - st);
  }, []);

  const [active, setActive] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    const onBlur = navigation.addListener("blur", () => {
      setActive(false);
    });
    const onFocus = navigation.addListener("focus", () => {
      setActive(true);
    });
    return () => {
      onBlur();
      onFocus();
    };
  }, [navigation]);

  const format = useMemo(
    () =>
      // photoheight and photowidth are landscape in formats
      formats
        ? formats.filter(
            (f) =>
              f.photoHeight === FRAME_WIDTH && f.photoWidth === FRAME_HEIGHT
          )[0]
        : undefined,
    [formats]
  );

  return (
    <View>
      <SafeAreaView
        style={{ backgroundColor: "black" }}
        edges={
          orientation === "PORTRAIT" ? ["top", "bottom"] : ["left", "right"]
        }
      >
        <StatusBar barStyle="light-content" />
        {device && format ? (
          <View>
            <View
              style={[
                cameraStyles.cameraContainer,
                {
                  height:
                    orientation === "PORTRAIT"
                      ? (windowWidth * FRAME_HEIGHT) / FRAME_WIDTH
                      : "100%",
                  width:
                    orientation === "PORTRAIT"
                      ? "100%"
                      : (windowWidth * FRAME_HEIGHT) / FRAME_WIDTH,
                  // marginTop: orientation === "PORTRAIT" ? 50 : 0,
                  // marginLeft: orientation === "LANDSCAPE" ? 50 : 0,
                  backgroundColor: "black",
                },
              ]}
            >
              <Camera
                style={cameraStyles.camera}
                device={device}
                isActive={active}
                frameProcessor={frameProcessor}
                frameProcessorFps={30}
                enableZoomGesture={true}
                format={format}
              >
                <View
                  style={[
                    cameraStyles.overlay,
                    {
                      height:
                        orientation === "PORTRAIT"
                          ? (windowWidth * FRAME_HEIGHT) / FRAME_WIDTH
                          : "100%",
                      width:
                        orientation === "PORTRAIT"
                          ? "100%"
                          : (windowWidth * FRAME_HEIGHT) / FRAME_WIDTH,
                    },
                  ]}
                >
                  <Svg
                    style={StyleSheet.absoluteFill}
                    viewBox={`0 0 ${
                      orientation === "PORTRAIT" ? FRAME_WIDTH : FRAME_HEIGHT
                    } ${
                      orientation === "PORTRAIT" ? FRAME_HEIGHT : FRAME_WIDTH
                    }`}
                  >
                    <AnimatedRect animatedProps={rectProps} />
                    <AnimatedCircle animatedProps={ballProps} />
                  </Svg>
                  {/* <View
                  style={[shotStateContainerStyles, cameraStyles.statusView]}
                >
                  <ReText
                    text={shotState}
                    style={{
                      color: shotState.value === "Score" ? "#3f6" : "#c10",
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                  />
                </View> */}
                  {/* <Pressable
                    onPress={flipCamera}
                    style={{
                      position: "absolute",
                      right: 0,
                    }}
                  >
                    <Text style={tailwind("text-xl text-white font-bold")}>
                      Flip
                    </Text>
                  </Pressable> */}
                  {/* <View style={cameraStyles.buttonView}> */}
                  <Pressable
                    onPress={() => {
                      if (detectedHoop) updateHoop.value = false;
                    }}
                    style={[
                      cameraStyles.recordButton,
                      {
                        borderColor: "red",
                        borderWidth: !updateHoop ? 5 : 0,
                        right: orientation === "LANDSCAPE" ? 20 : "auto",
                        bottom: orientation === "PORTRAIT" ? 20 : "auto",
                      },
                    ]}
                  >
                    {/* <Text style={tailwind("text-xl text-white font-bold")}>
                        
                      </Text> */}
                  </Pressable>
                  {/* </View> */}
                </View>
              </Camera>
            </View>
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </SafeAreaView>
      <View
        style={
          orientation === "LANDSCAPE" ? barStyles.sidebar : { display: "none" }
        }
      >
        <Pressable onPress={flipCamera} style={cameraStyles.button}>
          <Text style={tailwind("text-xl text-white font-bold")}>Flip</Text>
        </Pressable>
      </View>
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
    // backgroundColor: "white",
  },
});

const cameraStyles = StyleSheet.create({
  camera: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 1,
    borderWidth: 0,
    borderColor: "black",
    borderRadius: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: "white",
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
