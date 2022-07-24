import {
  Text,
  Pressable,
  View,
  Image,
  ScrollView,
  StatusBar,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import Navigation from "../Navigation";
import { useTailwind } from "tailwind-rn/dist";
import { THEME_COLORS } from "../../theme";
import ColorBox from "../../components/lib/color-box/ColorBox";
import ButtonText from "../../components/lib/text/ButtonText";
import TitleText from "../../components/lib/text/TitleText";
import BodyText from "../../components/lib/text/BodyText";
import Icon from "../../components/lib/buttons/icon-button/Icon";
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
import useAuth, { connect } from "../../hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tokenValid from "../../hooks/api/tokenValid";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import { ticketABI } from "../../hooks/api/ticketContract";
import { tokenABI } from "../../hooks/api/tokenABI";
import ConnectStep from "./steps/Connect";
import CreateStep from "./steps/Create";
import BuyStep from "./steps/Buy";
import ScrollScreen from "../../components/lib/spacing/ScrollScreen";
import FadeHeader from "../../components/lib/spacing/FadeHeader";
import LoadingScreen from "../LoadingScreen";
import APP_ENV from "../../../env";

export default function Login() {
  const tw = useTailwind();
  const connector = useWalletConnect();
  const [step, setStep] = useState<"connect" | "create" | "buy" | "done">(
    "connect"
  );

  const [fontsLoaded] = useFonts({
    Montserrat_900Black,
    FiraCode_400Regular,
    Montserrat_700Bold,
    FiraCode_700Bold,
  });

  let count = 0;

  // connector.killSession();

  useEffect(() => {
    if (connector.connected) {
      (async () => {
        const sessionToken = await AsyncStorage.getItem("EAGLE_SESSION_TOKEN");
        const valid = await tokenValid(
          sessionToken || "",
          connector.accounts[0]
        );
        // get new token if signed into new account
        if (!valid["valid"]) {
          const res = await (await fetch(APP_ENV.BACKEND_URL + "/auth")).json();
          const signed = await connector.signPersonalMessage([
            res["session"],
            connector.accounts[0],
          ]);
          const data = await connect(signed, connector.accounts[0]);
          AsyncStorage.setItem("EAGLE_SESSION_TOKEN", data["token"]);
          if (data["exists"]) setStep("done");
          else setStep("create");
        } else if (!valid["exists"]) {
          setStep("create");
        } else {
          setStep("done");
        }
      })();
    } else {
      setStep("connect");
    }
  }, [connector.connected]);

  const stepComponent = {
    connect: <ConnectStep onPress={() => connector.connect()} />,
    create: <CreateStep onComplete={() => setStep("buy")} />,
    buy: <BuyStep onComplete={() => setStep("done")} />,
    done: <View />,
  };

  return connector.connected && step === "done" ? (
    <LoadingScreen>
      <Navigation />
    </LoadingScreen>
  ) : fontsLoaded ? (
    <>
      <OrientationLocker orientation={PORTRAIT} />
      <StatusBar barStyle="light-content" />
      <View
        style={[
          tw("w-full h-full flex justify-center"),
          { backgroundColor: THEME_COLORS.dark[800].color },
        ]}
      >
        <View style={tw("h-full flex justify-center")}>
          <SafeAreaView
            style={{
              // position: "absolute",
              top: 0,
              paddingTop: 10,
              zIndex: 100,
              // paddingHorizontal: 30,
              width: "100%",
            }}
          >
            <FadeHeader>
              <View style={{ paddingLeft: 30, paddingTop: 10, width: "100%" }}>
                <Icon name="Logo" width={176} height={100} />
              </View>
            </FadeHeader>
            <ScrollScreen>
              <View style={{ paddingTop: 90, paddingHorizontal: 30 }}>
                {stepComponent[step]}
              </View>
            </ScrollScreen>
          </SafeAreaView>
        </View>
      </View>
    </>
  ) : (
    <View />
  );
}
