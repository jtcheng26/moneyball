import React from "react";
import { StyleSheet, View } from "react-native";
import { TailwindProvider } from "tailwind-rn/dist";
import Home from "./src/screens/Home";
import utilities from "./tailwind.json";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import Navigation from "./src/screens/Navigation";
import BottomTabs from "./src/components/bottom-tabs/BottomTabs";

export default function App() {
  return (
    <NavigationContainer>
      <View>
        <TailwindProvider utilities={utilities}>
          <BottomTabs />
        </TailwindProvider>
      </View>
    </NavigationContainer>
  );
}
