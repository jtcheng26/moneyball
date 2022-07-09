import { View, Text } from "react-native";
import React from "react";
import IconButton from "../lib/buttons/icon-button/IconButton";
import { THEME_COLORS } from "../../theme";

type Props = {
  location?: string;
  name: string;
  height?: number;
};

const LocationPill = (props: Props) => {
  return (
    <IconButton
      icon="Location"
      // width={150}
      height={props.height || 40}
      iconSize={22}
      underline
      color={THEME_COLORS.theme[50]}
      labelProps={{
        text: props.name,
        color: THEME_COLORS.dark[800],
        size: 15,
      }}
    />
  );
};

export default LocationPill;
