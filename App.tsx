import React from "react";
import { StyleSheet, View } from "react-native";
import { TailwindProvider } from "tailwind-rn/dist";
import Home from "./src/pages/Home";
import utilities from "./tailwind.json";

export default function App() {
  return (
    <View>
      <TailwindProvider utilities={utilities}>
        <Home />
      </TailwindProvider>
    </View>
  );
}
