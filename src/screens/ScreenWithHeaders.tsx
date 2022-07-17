import { StatusBar, StyleSheet, Text, View } from "react-native";
import React from "react";
import { THEME_COLORS } from "../theme";
import { OrientationLocker } from "react-native-orientation-locker";
import FadeHeader from "../components/lib/spacing/FadeHeader";
import TokenButton from "../components/currency-button/TokenButton";
import TicketButton from "../components/currency-button/TicketButton";
import ProfilePill from "../components/profile/ProfilePill";
import useAuth from "../hooks/useAuth";
import useActiveGames from "../hooks/useActiveGames";
import useTickets from "../hooks/useTickets";
import useTrophies from "../hooks/useTrophies";
import useTokens from "../hooks/useTokens";
import useUserData from "../hooks/useUserData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWalletConnect } from "@walletconnect/react-native-dapp";

type Props = {
  children?: React.ReactNode;
};

const ScreenWithHeaders = (props: Props) => {
  const { data: auth } = useAuth();
  const { data: user, isSuccess, refetch: refetchUser } = useUserData();
  const { data: tix, refetch: refetchTix } = useTickets();
  const { data: trophies, refetch: refetchTrophies } = useTrophies();
  const { data: tokens, refetch: refetchTokens } = useTokens();
  const connector = useWalletConnect();
  function logout() {
    AsyncStorage.removeItem("EAGLE_SESSION_TOKEN");
    connector.killSession();
  }
  return (
    <View style={{ backgroundColor: THEME_COLORS.dark[800].color }}>
      <OrientationLocker orientation="PORTRAIT" />
      <StatusBar barStyle="light-content" />
      <FadeHeader>
        <View style={styles.headerBar}>
          {isSuccess && (
            <ProfilePill
              name={user.name}
              trophies={trophies || trophies == 0 ? trophies : 0}
              icon={user.icon}
              onPress={logout} // TODO: move this to profile page
            />
          )}
        </View>
      </FadeHeader>
      <View style={styles.currencyBox}>
        <TokenButton value={tokens || tokens == 0 ? tokens : 0} />
        <View style={{ width: 20 }} />
        <TicketButton value={tix || tix == 0 ? tix : 0} />
      </View>
      {props.children}
    </View>
  );
};

export default ScreenWithHeaders;

const styles = StyleSheet.create({
  headerBar: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  currencyBox: {
    position: "absolute",
    top: 130,
    right: 20,
    zIndex: 100,
    display: "flex",
    flexDirection: "row",
  },
});
