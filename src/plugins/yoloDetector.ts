import type { Frame } from "react-native-vision-camera";

export function yoloDetector(frame: Frame): number[] {
  "worklet";
  return __yoloDetector(frame);
}
