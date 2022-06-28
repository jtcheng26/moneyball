import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Camera,
  CameraDevice,
  useCameraDevices,
  useFrameProcessor,
} from "react-native-vision-camera";
import { useTailwind } from "tailwind-rn/dist";
import { yoloDetector } from "../plugins/yoloDetector";
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

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

enum DetectionClass {
  Basketball = 0,
  Hoop = 1,
}

interface HoopDetection {
  box: {
    x: number; // top-left
    y: number; // top-left
    width: number;
    height: number;
  };
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

console.log(windowWidth);
console.log(windowHeight);

interface BallDetection {
  box: {
    cx: number; // center
    cy: number; // center
    radius: number;
  };
  opacity: number;
}

interface VisionCameraViewProps {
  close: () => void;
}

export default function VisionCameraView({ close }: VisionCameraViewProps) {
  const tailwind = useTailwind();
  const cam = useCameraDevices("wide-angle-camera");
  const [device, setDevice] = useState<CameraDevice | undefined>();
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
      if (noShotFrames.value < 50) noShotFrames.value += 1;
      if (noShotFrames.value == 50) {
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

  return (
    <View>
      {device ? (
        <>
          <View style={cameraStyles.cameraContainer}>
            <Camera
              style={cameraStyles.camera}
              device={device}
              isActive={true}
              frameProcessor={frameProcessor}
              frameProcessorFps={30}
            >
              <View style={cameraStyles.overlay}>
                <Svg style={StyleSheet.absoluteFill} viewBox="0 0 1080 1920">
                  <AnimatedRect animatedProps={rectProps} />
                  <AnimatedCircle animatedProps={ballProps} />
                </Svg>
                <View
                  style={[shotStateContainerStyles, cameraStyles.statusView]}
                >
                  <ReText
                    text={shotState}
                    style={{
                      color: shotState.value === "Score" ? "#3f6" : "#c10",
                      fontSize: 30,
                      fontWeight: "bold",
                    }}
                  />
                </View>
                <View style={cameraStyles.buttonView}>
                  <Pressable
                    onPress={() => (updateHoop.value = false)}
                    style={cameraStyles.button}
                  >
                    <Text style={tailwind("text-xl text-white font-bold")}>
                      Detect
                    </Text>
                  </Pressable>
                  <Pressable onPress={flipCamera} style={cameraStyles.button}>
                    <Text style={tailwind("text-xl text-white font-bold")}>
                      Flip
                    </Text>
                  </Pressable>
                  <Pressable onPress={close} style={cameraStyles.button}>
                    <Text style={tailwind("text-xl text-white font-bold")}>
                      Close
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Camera>
          </View>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}

const cameraStyles = StyleSheet.create({
  camera: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 1,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 0,
  },
  cameraContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: (windowWidth * 1920) / 1080,
    marginTop: 80,
    backgroundColor: "#fff",
  },
  overlay: {
    zIndex: 2,
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
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
    margin: 10,
    padding: 10,
  },
  statusView: {
    paddingHorizontal: 50,
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(40, 40, 40)",
    borderRadius: 10,
    margin: 20,
  },
});
