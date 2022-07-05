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

export default function UILibrary1() {
  const tw = useTailwind();
  return (
    <View
      style={[
        tw("w-full h-full flex justify-center px-8"),
        { backgroundColor: THEME_COLORS.dark[800].color },
      ]}
    >
      <Scoreboard
        scores={[0, 1]}
        title="Solo practice"
        timeLeft={1800}
        active
        underline
      />
      <TitleText text="Active games" />
      <BodyText>
        Tickets are used to play public matches and earn Tokens. Tokens are real
        crypto that can be sold for real value. Buy some tickets to get started!
      </BodyText>
      <ButtonText text="Play Game" />
      <LabelText text="SHOOTING PERCENTAGE" />
      <LabelText text="The Gym" />
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
      <IconButton
        icon="Location"
        // width={150}
        height={40}
        iconSize={22}
        underline
        color={THEME_COLORS.theme[50]}
        labelProps={{
          text: "The Gym",
          color: THEME_COLORS.dark[800],
          size: 15,
        }}
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
    </View>
  );
}
