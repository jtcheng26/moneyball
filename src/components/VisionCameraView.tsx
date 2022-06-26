import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from "react-native-vision-camera";
import { useTailwind } from "tailwind-rn/dist";
import { yoloDetector } from "../plugins/yoloDetector";
import "react-native-reanimated";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

enum DetectionClass {
  Basketball = 0,
  Hoop = 1,
}

interface DetectionResult {
  box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  score: number;
  class: DetectionClass;
}

interface VisionCameraViewProps {
  close: () => void;
}

export default function VisionCameraView({ close }: VisionCameraViewProps) {
  const tailwind = useTailwind();
  const device = useCameraDevices("wide-angle-camera").back;
  const hoopDetection = useSharedValue<DetectionResult | null>(null);
  const ballDetection = useSharedValue<DetectionResult | null>(null);

  const hoopStyles = useAnimatedStyle(() => {
    if (hoopDetection.value) {
      console.log(
        hoopDetection.value.box.x,
        hoopDetection.value.box.y,
        hoopDetection.value.box.width,
        hoopDetection.value.box.height
      );
      return {
        left:
          100 *
            (hoopDetection.value.box.x - hoopDetection.value.box.width / 2) +
          "%",
        top:
          100 *
            (hoopDetection.value.box.y - hoopDetection.value.box.height / 2) +
          "%",
        width: hoopDetection.value.box.width * 100 + "%",
        height: hoopDetection.value.box.height * 100 + "%",
        // position: "absolute",
        borderWidth: 5,
        borderColor: "red",
        backgroundColor: "transparent",
        borderRadius: 5,
      };
    }
    return {};
  });
  // x * h = y
  // x * w = y
  const ballStyles = useAnimatedStyle(() => {
    if (ballDetection.value) {
      console.log(
        ballDetection.value.box.x,
        ballDetection.value.box.y,
        ballDetection.value.box.width,
        ballDetection.value.box.height
      );
      return {
        left:
          100 *
            (ballDetection.value.box.x - ballDetection.value.box.width / 2) +
          "%",
        top:
          100 *
            (ballDetection.value.box.y -
              (ballDetection.value.box.height * (1080 / 1920)) / 2) +
          "%",
        width: ballDetection.value.box.width * 100 + "%",
        height: ballDetection.value.box.height * 100 * (1080 / 1920) + "%",
        // position: "absolute",
        borderWidth: 5,
        borderColor: "green",
        backgroundColor: "transparent",
        borderRadius: 5,
      };
    }
    return {};
  });

  const frameProcessor = useFrameProcessor((frame) => {
    "worklet";
    const st = Date.now();
    const detectionsRes = yoloDetector(frame);
    // console.log(detectionsRes);
    let newDetections: DetectionResult[] = [];
    for (let i = 0; i < detectionsRes[0]; i++) {
      let res: DetectionResult = {
        box: {
          x: detectionsRes[i * 4 + 1],
          y: detectionsRes[i * 4 + 2],
          width: detectionsRes[i * 4 + 3],
          height: detectionsRes[i * 4 + 4],
        },
        score: detectionsRes[1 + detectionsRes[0] * 4 + i],
        class: detectionsRes[1 + detectionsRes[0] * 5 + i],
      };
      newDetections.push(res);
    }

    if (newDetections.length > 0) {
      function bestScore(
        detections: DetectionResult[],
        category: DetectionClass
      ) {
        const best = detections.reduce((prev, now) => {
          if (now.class === category) {
            if (prev.class !== category || now.score > prev.score) {
              return now;
            }
          }
          return prev;
        });

        return best.class === category ? best : null;
      }

      const basketball = bestScore(newDetections, DetectionClass.Basketball);
      const hoop = bestScore(newDetections, DetectionClass.Hoop);
      if (basketball) ballDetection.value = basketball;
      else ballDetection.value = null;
      if (hoop) hoopDetection.value = hoop;
      else hoopDetection.value = null;
    } else {
      ballDetection.value = null;
      hoopDetection.value = null;
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
                <Animated.View style={hoopStyles} />
                <Animated.View style={ballStyles} />
                <Pressable onPress={close} style={cameraStyles.button}>
                  <Text style={tailwind("text-xl text-white font-bold")}>
                    Close
                  </Text>
                </Pressable>
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
    height: "100%",
    backgroundColor: "#fff",
  },
  overlay: {
    zIndex: 2,
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    // position: "relative",
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
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 40,
    padding: 10,
    borderRadius: 10,
  },
});
