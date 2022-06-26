import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useTailwind } from "tailwind-rn/dist";
import CameraView from "../components/VisionCameraView";

export default function Home() {
  const tailwind = useTailwind();

  const [started, setStarted] = useState(false);

  function setStart() {
    setStarted(true);
  }
  function setEnd() {
    setStarted(false);
  }
  return (
    <View style={tailwind("h-full w-full")}>
      {started ? (
        <CameraView close={setEnd} />
      ) : (
        <Pressable style={buttonStyle.button} onPress={setStart}>
          <Text style={tailwind("text-white font-bold text-xl")}>Start</Text>
        </Pressable>
      )}
    </View>
  );
}

const buttonStyle = StyleSheet.create({
  button: {
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowColor: "black",
    shadowOpacity: 0.4,
    backgroundColor: "#2af",
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 40,
    padding: 10,
    borderRadius: 10,
  },
});
