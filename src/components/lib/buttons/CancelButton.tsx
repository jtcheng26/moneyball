import { View, Text } from "react-native";
import React from "react";
import { ThemeColor, THEME_COLORS } from "../../../theme";
import IconButton from "./icon-button/IconButton";

type Props = {
  size?: number;
  color?: ThemeColor;
  iconColor?: ThemeColor;
  onCancel?: () => void;
};

const CancelButton = (props: Props) => {
  return (
    <IconButton
      icon="X"
      iconSize={props.size ? Math.sqrt(0.3 * props.size * props.size) : 27}
      width={props.size || 50}
      height={props.size || 50}
      underline
      color={props.color || THEME_COLORS.dark[50]}
      iconColor={props.iconColor}
      onPress={props.onCancel}
    />
  );
};

export default CancelButton;
