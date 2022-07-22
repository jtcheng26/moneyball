import React from "react";
import { View } from "react-native";
import { TailwindProvider } from "tailwind-rn/dist";
import utilities from "./tailwind.json";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import WalletConnectProvider from "@walletconnect/react-native-dapp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Login from "./src/screens/Onboarding/Login";
import { THEME_COLORS } from "./src/theme";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <View
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: THEME_COLORS.dark[800].color,
        }}
      >
        <TailwindProvider utilities={utilities}>
          <WalletConnectProvider
            redirectUrl="/"
            storageOptions={{ asyncStorage: AsyncStorage }}
          >
            <QueryClientProvider client={queryClient}>
              <Login />
            </QueryClientProvider>
          </WalletConnectProvider>
        </TailwindProvider>
      </View>
    </NavigationContainer>
  );
}
