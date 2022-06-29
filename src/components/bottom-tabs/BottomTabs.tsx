import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../../screens/Home";
import VisionCameraView from "../camera-view/VisionCameraView";
import { View } from "react-native";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <View style={{ height: "100%" }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 60,
            paddingBottom: 10,
            paddingTop: 10,
            backgroundColor: "#016D76",
            borderRadius: 300,
            marginBottom: 10,
            marginHorizontal: 10,
          },
          tabBarActiveTintColor: "#EE786B",
          tabBarInactiveTintColor: "white",
          tabBarLabelStyle: {
            color: "white",
          },
        }}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Cam" component={VisionCameraView} />
      </Tab.Navigator>
    </View>
  );
}
