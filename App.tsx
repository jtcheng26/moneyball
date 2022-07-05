import React from "react";
import { View } from "react-native";
import { TailwindProvider } from "tailwind-rn/dist";
import utilities from "./tailwind.json";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import WalletConnectProvider from "@walletconnect/react-native-dapp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Login from "./src/screens/Login";

export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <View style={{ height: "100%", width: "100%", backgroundColor: "black" }}>
        <TailwindProvider utilities={utilities}>
          <WalletConnectProvider
            redirectUrl="/"
            storageOptions={{ asyncStorage: AsyncStorage }}
          >
            <Login />
          </WalletConnectProvider>
        </TailwindProvider>
      </View>
    </NavigationContainer>
  );
}
