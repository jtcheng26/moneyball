import { View, Text } from "react-native";
import React from "react";
import { useOrientation } from "../../hooks/useOrientation";
import { BottomTabBar } from "@react-navigation/bottom-tabs";

function TabBar(props) {
  const orientation = useOrientation();
  return orientation === "PORTRAIT" ? <BottomTabBar {...props} /> : <View />;
}

export default function returnTabBar(props) {
  return <TabBar {...props} />;
}
