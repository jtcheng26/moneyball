import { View, Text, Pressable } from "react-native";
import React from "react";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { useTailwind } from "tailwind-rn/dist";

export default function Logout() {
  const tw = useTailwind();
  const connector = useWalletConnect();
  return !connector.connected ? (
    <View>
      <Text>Log in first!</Text>
    </View>
  ) : (
    <View style={tw("w-full h-full flex items-center justify-center bg-white")}>
      <Pressable onPress={() => connector.killSession()}>
        <Text style={{ color: "black" }}>Logout</Text>
      </Pressable>
    </View>
  );
}
