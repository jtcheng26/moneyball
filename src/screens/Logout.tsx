import { View, Text, Pressable } from "react-native";
import React from "react";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { useTailwind } from "tailwind-rn/dist";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Logout() {
  const tw = useTailwind();
  const connector = useWalletConnect();
  function logout() {
    AsyncStorage.removeItem("EAGLE_SESSION_TOKEN");
    connector.killSession();
  }
  return !connector.connected ? (
    <View>
      <Text>Log in first!</Text>
    </View>
  ) : (
    <View style={tw("w-full h-full flex items-center justify-center bg-white")}>
      <Pressable onPress={logout}>
        <Text style={{ color: "black" }}>Logout</Text>
      </Pressable>
    </View>
  );
}
