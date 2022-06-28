import type { Frame } from "react-native-vision-camera";

export function yoloDetector(frame: Frame, updateHoop: boolean): number[] {
  "worklet";
  return __yoloDetector(frame, updateHoop);
}
