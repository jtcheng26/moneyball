import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { useTailwind } from "tailwind-rn/dist";
import CameraView from "../components/CameraView";

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
    <View style={tailwind("h-full w-full pt-10")}>
      {started ? (
        <CameraView close={setEnd} />
      ) : (
        <Pressable
          style={tailwind("px-5 py-3 bg-blue-400 rounded-md")}
          onPress={setStart}
        >
          <Text style={tailwind("text-white font-bold text-xl")}>Start</Text>
        </Pressable>
      )}
    </View>
  );
}
