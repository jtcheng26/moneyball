import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../../screens/Home";
import VisionCameraView from "../camera-view/VisionCameraView";
import { View } from "react-native";
import TabBar from "./TabBar";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <View style={{ height: "100%" }}>
      <Tab.Navigator
        tabBar={TabBar}
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            paddingBottom: 30,
            paddingTop: 0,
            backgroundColor: "black",
            borderTopWidth: 0,
            // borderRadius: 300,
            marginBottom: 10,
            // marginHorizontal: 10,
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
