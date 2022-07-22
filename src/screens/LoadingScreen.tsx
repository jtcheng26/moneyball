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
import ReactNativeModal from "react-native-modal";
import {
  VisualCurrencyCtx,
  VisualCurrencyUpdate,
} from "../contexts/visualCurrency";

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
  const {
    data: dataTix,
    isSuccess: tixLoaded,
    refetch: refetchTix,
  } = useTickets();
  const {
    data: dataTrophies,
    isSuccess: trophiesLoaded,
    refetch: refetchTrophies,
  } = useTrophies();
  const {
    data: dataTokens,
    isSuccess: tokensLoaded,
    refetch: refetchTokens,
  } = useTokens();
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
  const [currencyCtx, setCurrencyCtx] = useState({
    tix: 0,
    tokens: 0,
    trophies: 0,
  });
  const currencyCtxValue = useMemo(
    () => ({
      tix: currencyCtx.tix,
      tokens: currencyCtx.tokens,
      trophies: currencyCtx.trophies,
      upd: (upd: VisualCurrencyUpdate) => {
        setCurrencyCtx({
          tix: currencyCtx.tix + (upd.tix ? upd.tix : 0),
          tokens: currencyCtx.tokens + (upd.tokens ? upd.tokens : 0),
          trophies: currencyCtx.trophies + (upd.trophies ? upd.trophies : 0),
        });
      },
    }),
    [currencyCtx]
  );
  useMemo(async () => {
    if (authLoaded) {
      if (!pastGamesSuccess) await refetchRecent();
      if (!tokensLoaded) await refetchTokens();
      if (!trophiesLoaded) await refetchTrophies();
      if (!tixLoaded) await refetchTix();
      if (!userLoaded && tixLoaded && trophiesLoaded && tokensLoaded)
        await refetchUser();
      if (!activeGamesSuccess) await refetch();
    }

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
    ) {
      console.log(dataTokens, dataTix);
      setCurrencyCtx({
        tix: dataTix,
        tokens: dataTokens,
        trophies: dataTrophies,
      });
      setTimeout(() => {
        setLoaded(true);
      }, 500);
    }
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
  return (
    <>
      <ReactNativeModal
        isVisible={!loaded}
        useNativeDriver
        style={styles.modal}
        hideModalContentWhileAnimating
        animationInTiming={10}
        animationIn="fadeIn"
      >
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
      </ReactNativeModal>
      <VisualCurrencyCtx.Provider value={currencyCtxValue}>
        {props.children}
      </VisualCurrencyCtx.Provider>
    </>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  modal: {
    width: "100%",
    height: "100%",
    margin: 0,
  },
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 100000,
    backgroundColor: THEME_COLORS.dark[800].color,
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
