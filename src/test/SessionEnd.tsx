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
import SessionRecapScreen from "../screens/SessionRecap";

export default function SessionEnd() {
  const tw = useTailwind();
  return (
    <View style={{ backgroundColor: THEME_COLORS.dark[800].color }}>
      <SessionRecapScreen
        recap={{
          make: 4,
          miss: 2,
          time: 600,
        }}
        modeConfig={SoloPracticeConfig}
        video="file:///private/var/mobile/Containers/Data/Application/33444F00-B948-4689-969E-A33B19748EF6/tmp/ReactNative/127C5721-6CF4-47F5-A5D4-9C6628C0D716.mov"
        thumbnail="file:///private/var/mobile/Containers/Data/Application/33444F00-B948-4689-969E-A33B19748EF6/tmp/ReactNative/0B535171-41AB-4415-B93C-FEA4E56BB586.jpeg"
      />
    </View>
  );
}
