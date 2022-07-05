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
}

export default function BoxScore({
  color,
  value,
  underline,
  width,
  height,
}: BoxScoreProps) {
  return (
    <ColorBox underline={underline} color={color} width={width} height={height}>
      <LabelText color={THEME_COLORS.dark[0]} text={value} size={40} />
    </ColorBox>
  );
}
