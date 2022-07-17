import { View, Text } from "react-native";
import React from "react";
import { useTailwind } from "tailwind-rn/dist";
import Scoreboard from "../components/lib/scoreboard/Scoreboard";
import { THEME_COLORS } from "../theme";
import TitleText from "../components/lib/text/TitleText";
import BodyText from "../components/lib/text/BodyText";
import ButtonText from "../components/lib/text/ButtonText";
import LabelText from "../components/lib/text/LabelText";
import IconButton from "../components/lib/buttons/icon-button/IconButton";
import SideIconButton from "../components/lib/buttons/side-icon-button/SideIconButton";
import GameButton from "../components/game-button/GameButton";
import { SoloPracticeConfig } from "../configs/soloPracticeConfig";
import GameCard from "../components/lib/cards/GameCard";
import Dialog from "../components/lib/dialogs/Dialog";
import ConfirmationDialog from "../components/lib/dialogs/ConfirmationDialog";
import GameConfirmDialog from "../components/lib/dialogs/GameConfirmDialog";
import { RankedMatchConfig } from "../configs/rankedMatchConfig";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileButton from "../components/lib/profile-button/ProfileButton";
import GameResult from "../components/game-button/GameResult";
import PurchaseButton from "../components/purchase/PurchaseButton";
import ActiveGameCard from "../components/game-button/ActiveGameCard";
import { GameCode } from "../data/data.types";

export default function UILibrary2() {
  const tw = useTailwind();
  return (
    <View style={{ backgroundColor: THEME_COLORS.dark[800].color }}>
      <ScrollView
        contentContainerStyle={[
          tw("w-full flex justify-center px-8"),
          {
            backgroundColor: THEME_COLORS.dark[800].color,
            paddingVertical: 20,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView>
          <GameButton
            config={SoloPracticeConfig}
            onPress={() => console.log("starting game")}
          />
          <GameButton
            config={RankedMatchConfig}
            onPress={() => console.log("starting game")}
          />
          <ConfirmationDialog
            title="Are you sure you want to exit?"
            body="You will lose all rewards and progress."
          />
          <IconButton
            icon="X"
            iconSize={30}
            width={50}
            height={50}
            underline
            color={THEME_COLORS.dark[50]}
          />
          <IconButton
            icon="Check"
            iconSize={30}
            width={50}
            height={50}
            underline
            color={THEME_COLORS.green[500]}
          />
          <SideIconButton
            icon="CoinSolid"
            text={"10,000,000"}
            color={THEME_COLORS.green[500]}
            underline
            height={40}
            labelProps={{ size: 15 }}
          />
          <SideIconButton
            icon="Ticket"
            text={"10,000,000"}
            color={THEME_COLORS.theme[400]}
            underline
            height={40}
            labelProps={{ size: 15 }}
          />
          <ProfileButton
            name="Jeff"
            trophies={100}
            icon="Basketball"
            color={THEME_COLORS.theme[400]}
          />
          <View style={{ height: 10 }} />
          <ProfileButton
            name="Jeff"
            trophies={100}
            icon="Basketball"
            color={THEME_COLORS.theme[400]}
            status="GOOD"
            score={20}
            height={50}
            width={220}
            onPress={() => {
              console.log("press");
            }}
          />
          <View style={{ height: 20 }} />
          <GameResult
            config={SoloPracticeConfig}
            result={{
              id: 0,
              user: {
                id: "a",
                name: "Jeff",
                icon: "Basketball",
                address: "hello",
                tickets: 100,
                trophies: 50,
                tokens: 0,
              },
              userScore: 5,
              modeCode: "solo-practice",
              ticketCost: 0,
              userRecap: {
                make: 5,
                miss: 8,
                time: 120,
                mode: GameCode.SOLO_PRACTICE,
                video: "",
                thumbnail: "",
              },
            }}
          />
          <View style={{ height: 20 }} />
          <GameResult
            config={RankedMatchConfig}
            result={{
              id: 0,
              user: {
                id: "a",
                name: "Jeff",
                icon: "Basketball",
                address: "hello",
                tickets: 100,
                trophies: 50,
                tokens: 0,
              },
              opponent: {
                name: "Joe",
                icon: "Basketball",
                trophies: 30,
                address: "yo",
              },
              userScore: 5,
              opponentScore: 7,
              modeCode: "ranked-match",
              ticketCost: 200,
              userRecap: {
                make: 7,
                miss: 8,
                time: 120,
                mode: GameCode.SOLO_PRACTICE,
                video: "",
                thumbnail: "",
              },
            }}
          />
          <View style={{ height: 20 }} />
          <PurchaseButton amount={1000} price={1000} currency={"BTT"} />
          <View style={{ height: 20 }} />
          <ActiveGameCard
            config={RankedMatchConfig}
            game={{
              id: "27263636",
              mode_id: "ranked-match" as GameCode,
              players: [
                {
                  id: "0xa3d199f96535c98c716bbfd7f5a1a94fcb8170be",
                  name: "A3",
                  icon: "Basketball",
                  trophies: 100,
                  score: 0,
                  scored: false,
                },
                {
                  id: "0xae531c39c1bb7c9f4a5ea1b523427f85c568ef71",
                  name: "AE",
                  icon: "Basketball",
                  trophies: 50,
                  score: 10,
                  scored: true,
                },
              ],
              time_end: 1657920038,
            }}
            startGame={() => console.log("start")}
          />
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}
