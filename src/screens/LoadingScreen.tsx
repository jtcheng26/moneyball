import { StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import {
  useFonts,
  Montserrat_900Black,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import {
  FiraCode_700Bold,
  FiraCode_400Regular,
} from "@expo-google-fonts/fira-code";
import useActiveGames from "../hooks/useActiveGames";
import useTokens from "../hooks/useTokens";
import useTrophies from "../hooks/useTrophies";
import useTickets from "../hooks/useTickets";
import useUserData from "../hooks/useUserData";
import useAuth from "../hooks/useAuth";
import Spinner from "react-native-spinkit";
import Icon from "../components/lib/buttons/icon-button/Icon";
import { THEME_COLORS } from "../theme";
import useRecentGames from "../hooks/useRecentGames";
import { useWalletConnect } from "@walletconnect/react-native-dapp";

type Props = {
  children?: React.ReactNode;
};

const LoadingScreen = (props: Props) => {
  const conn = useWalletConnect();
  const [loaded, setLoaded] = useState(false);
  const [fontsLoaded] = useFonts({
    Montserrat_900Black,
    Montserrat_700Bold,
    FiraCode_400Regular,
    FiraCode_700Bold,
  });
  const { isSuccess: authLoaded } = useAuth();
  const {
    data: user,
    isSuccess: userLoaded,
    refetch: refetchUser,
  } = useUserData();
  const { isSuccess: tixLoaded, refetch: refetchTix } = useTickets();
  const { isSuccess: trophiesLoaded, refetch: refetchTrophies } = useTrophies();
  const { isSuccess: tokensLoaded, refetch: refetchTokens } = useTokens();
  const {
    data: activeGames,
    isSuccess: activeGamesSuccess,
    refetch,
  } = useActiveGames();
  const {
    data: pastGames,
    isSuccess: pastGamesSuccess,
    refetch: refetchRecent,
  } = useRecentGames(conn.accounts[0]);
  useMemo(async () => {
    if (!userLoaded) await refetchUser();
    if (!tixLoaded) await refetchTix();
    if (!trophiesLoaded) await refetchTrophies();
    if (!tokensLoaded) await refetchTokens();
    if (!activeGamesSuccess) await refetch();
    if (!pastGamesSuccess) await refetchRecent();
    if (
      !!user &&
      authLoaded &&
      fontsLoaded &&
      userLoaded &&
      tixLoaded &&
      trophiesLoaded &&
      tokensLoaded &&
      activeGamesSuccess &&
      pastGamesSuccess &&
      conn.connected
    )
      // console.log("loaded");
      setLoaded(true);
  }, [
    user,
    fontsLoaded,
    authLoaded,
    userLoaded,
    tixLoaded,
    trophiesLoaded,
    tokensLoaded,
    activeGamesSuccess,
    pastGamesSuccess,
    conn.connected,
  ]);
  return loaded ? (
    props.children
  ) : (
    <View style={styles.container}>
      <Icon name="Logo" width={176} height={100} />
      <View style={styles.loader}>
        <Spinner
          type="Circle"
          isVisible
          color={THEME_COLORS.theme[500].color}
          size={50}
        />
      </View>
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    bottom: "10%",
    // position: "",
  },
});
