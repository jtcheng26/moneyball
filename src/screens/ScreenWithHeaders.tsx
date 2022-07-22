import { StatusBar, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
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
import useVisualCurrency from "../hooks/useVisual";

type Props = {
  children?: React.ReactNode;
  noFill?: boolean;
  tix?: number; // for cosmetic updates while waiting for the actual contract to update
  trophies?: number;
  tokens?: number;
};

const ScreenWithHeaders = (props: Props) => {
  const { data: auth } = useAuth();
  const { data: user, isSuccess, refetch: refetchUser } = useUserData();
  const { tix, tokens, trophies } = useVisualCurrency();
  const connector = useWalletConnect();
  function logout() {
    AsyncStorage.removeItem("EAGLE_SESSION_TOKEN");
    connector.killSession();
  }
  return (
    <View
      style={{
        backgroundColor: props.noFill
          ? "transparent"
          : THEME_COLORS.dark[800].color,
      }}
    >
      <OrientationLocker orientation="PORTRAIT" />
      <StatusBar barStyle="light-content" />
      <FadeHeader transparent={props.noFill}>
        <View style={styles.headerBar}>
          {!!user && (
            <ProfilePill
              name={user.name}
              trophies={trophies}
              icon={user.icon}
              onPress={logout} // TODO: move this to profile page
            />
          )}
        </View>
      </FadeHeader>
      <View style={styles.currencyBox}>
        <TokenButton value={tokens} />
        <View style={{ width: 20 }} />
        <TicketButton value={tix} />
      </View>
      {props.children}
    </View>
  );
};;

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
