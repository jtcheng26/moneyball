import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useTailwind } from "tailwind-rn/dist";
import CameraView from "../components/camera-view/VisionCameraView";

export default function Home() {
  const tailwind = useTailwind();
  return (
    <View style={tailwind("h-full w-full flex items-center justify-center")}>
      <Text>Home</Text>
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
