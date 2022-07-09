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
            startGame={() => console.log("starting game")}
          />
          <GameButton
            config={RankedMatchConfig}
            startGame={() => console.log("starting game")}
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
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}
