import { View, Text } from "react-native";
import React from "react";
import { ThemeColor, THEME_COLORS } from "../../../theme";
import IconButton from "./icon-button/IconButton";

type Props = {
  size?: number;
  color?: ThemeColor;
  iconColor?: ThemeColor;
  onConfirm?: () => void;
  outline?: boolean;
};

const ConfirmButton = (props: Props) => {
  return (
    <IconButton
      icon="Check"
      iconSize={props.size ? Math.sqrt(0.4 * props.size * props.size) : 32}
      width={props.size || 50}
      height={props.size || 50}
      underline={!props.outline}
      color={props.color || THEME_COLORS.green[500]}
      iconColor={props.iconColor}
      onPress={props.onConfirm}
      disabled={!props.onConfirm}
    />
  );
};

export default ConfirmButton;
