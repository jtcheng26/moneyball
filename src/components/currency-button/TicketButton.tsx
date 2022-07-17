import { View, Text } from "react-native";
import React from "react";
import { THEME_COLORS } from "../../theme";
import SideIconButton from "../lib/buttons/side-icon-button/SideIconButton";

type Props = {
  value: number;
  onPress?: () => void;
  big?: boolean;
};

const TicketButton = (props: Props) => {
  const asString = (props.value + "")
    .split("")
    .reverse()
    .reduce((cum, curr, i) => {
      if (i > 0 && i % 3 == 0) {
        return curr + "," + cum;
      } else {
        return curr + cum;
      }
    }, "");

  return (
    <SideIconButton
      icon="Ticket"
      text={asString}
      color={THEME_COLORS.theme[400]}
      underline
      height={props.big ? 60 : 30}
      labelProps={{ size: props.big ? 20 : 13 }}
      pressable={!!props.onPress}
      onPress={props.onPress}
    />
  );
};

export default TicketButton;
