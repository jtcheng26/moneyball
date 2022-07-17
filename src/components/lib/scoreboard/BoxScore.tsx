import React from "react";
import { ThemeColor, THEME_COLORS } from "../../../theme";
import ColorBox from "../color-box/ColorBox";
import LabelText from "../text/LabelText";

interface BoxScoreProps {
  color: ThemeColor;
  value: string | number;
  underline?: boolean;
  width: number;
  height: number;
  size?: number;
}

export default function BoxScore({
  color,
  value,
  underline,
  width,
  height,
  size,
}: BoxScoreProps) {
  return (
    <ColorBox underline={underline} color={color} width={width} height={height}>
      <LabelText color={THEME_COLORS.dark[0]} text={value} size={size || 40} />
    </ColorBox>
  );
}
