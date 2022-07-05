import { Text, Pressable, View, Image } from "react-native";
import React from "react";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import Navigation from "./Navigation";
import { useTailwind } from "tailwind-rn/dist";
import { THEME_COLORS } from "../theme";
import ColorBox from "../components/lib/color-box/ColorBox";
import ButtonText from "../components/lib/text/ButtonText";
import TitleText from "../components/lib/text/TitleText";
import BodyText from "../components/lib/text/BodyText";
import Icon from "../components/lib/buttons/icon-button/Icon";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  OrientationLocker,
  PORTRAIT,
  LANDSCAPE,
} from "react-native-orientation-locker";
import {
  useFonts,
  Montserrat_900Black,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import {
  FiraCode_400Regular,
  FiraCode_700Bold,
} from "@expo-google-fonts/fira-code";
// import WalletConnectProvider from "@walletconnect/web3-provider";

// const provider = new WalletConnectProvider({
//   rpc: {
//     1029: "https://pre-rpc.bt.io",
//     // ...
//   },
// });

// provider.enable();

export default function Login() {
  const tw = useTailwind();
  const connector = useWalletConnect();

  const [fontsLoaded] = useFonts({
    Montserrat_900Black,
    FiraCode_400Regular,
    Montserrat_700Bold,
    FiraCode_700Bold,
  });

  return connector.connected ? (
    <Navigation />
  ) : fontsLoaded ? (
    <>
      <OrientationLocker orientation={PORTRAIT} />
      <View
        style={[
          tw("w-full h-full flex justify-center px-8"),
          { backgroundColor: THEME_COLORS.dark[800].color },
        ]}
      >
        <View style={tw("h-full flex justify-center")}>
          <SafeAreaView
            style={{ position: "absolute", top: 0, paddingTop: 10 }}
          >
            <Icon name="Logo" width={176} height={100} />
          </SafeAreaView>
          <TitleText text="LOGIN" />
          <BodyText>
            Log in using a crypto wallet. It's easy to make one!
          </BodyText>
          <View style={{ height: 40 }} />
          <ColorBox
            color={THEME_COLORS.theme[400]}
            underline
            pressable
            onPress={() => connector.connect()}
            height={60}
            width={60}
            flex
            leftAlign
          >
            <ButtonText text="Login with WalletConnect" size={16} />
          </ColorBox>
        </View>
      </View>
    </>
  ) : (
    <View />
  );
}
