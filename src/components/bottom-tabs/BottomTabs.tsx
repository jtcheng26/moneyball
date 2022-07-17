import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import TabBar from "./TabBar";
import Logout from "../../screens/Logout";
import Play from "../../screens/Play";
import UILibrary1 from "../../test/UILibrary1";
import UILibrary2 from "../../test/UILibrary2";
import { THEME_COLORS } from "../../theme";
import Icon from "../lib/buttons/icon-button/Icon";
import Shop from "../../screens/Shop";
import LinearGradient from "react-native-linear-gradient";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <View
      style={{ height: "100%", backgroundColor: THEME_COLORS.dark[800].color }}
    >
      <Tab.Navigator
        initialRouteName="Play"
        tabBar={TabBar}
        screenOptions={{
          headerShown: false,
          tabBarBackground: () => (
            <LinearGradient
              colors={[
                THEME_COLORS.dark[800].underline + "FF",
                THEME_COLORS.dark[800].color + "DD",
                THEME_COLORS.dark[800].color + "00",
              ]}
              style={{ flex: 1 }}
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0 }}
            />
          ),
          tabBarStyle: {
            paddingBottom: 20,
            paddingTop: 50,
            height: 120,
            // backgroundColor: THEME_COLORS.dark[800].color + "EE",
            borderTopWidth: 0,
            // borderRadius: 300,
            // marginBottom: 10,
            position: "absolute",
            // marginHorizontal: 10,
          },
          // tabBarActiveTintColor: THEME_COLORS.theme[500].color,

          tabBarInactiveTintColor: THEME_COLORS.dark[200].color,
          // tabBarLabelStyle: {
          //   color: "white",
          // },
        }}
      >
        <Tab.Screen
          name="Shop"
          component={Shop}
          options={{
            tabBarLabel: "",
            tabBarIcon: ({ focused, color }) => (
              <Icon
                name="Ticket"
                fill={focused ? THEME_COLORS.theme[400].color : color}
                width={30}
                height={30}
              />
              // </View>
            ),
          }}
        />
        <Tab.Screen
          name="Play"
          component={Play}
          options={{
            tabBarLabel: "",
            tabBarIcon: ({ focused, color }) => (
              <Icon
                name="Basketball"
                fill={focused ? THEME_COLORS.theme[500].color : color}
                width={30}
                height={30}
              />
            ),
          }}
        />
        {/* <Tab.Screen name="UI" component={UILibrary1} />
        <Tab.Screen name="UI2" component={UILibrary2} /> */}
        {/* <Tab.Screen name="Logout" component={Logout} /> */}
      </Tab.Navigator>
    </View>
  );
}
