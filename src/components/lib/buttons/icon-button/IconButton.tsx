import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ColorBox from "../../color-box/ColorBox";
import Icon from "./Icon";
import { ThemeColor, THEME_COLORS } from "../../../../theme";
import LabelText, { LabelTextProps } from "../../text/LabelText";

type Props = {
  icon: string;
  height?: number;
  width?: number;
  iconSize?: number;
  color: ThemeColor;
  iconColor?: ThemeColor;
  underline?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  labelProps?: Partial<LabelTextProps>;
};

const IconButton = (props: Props) => {
  const height = props.height || 60;
  const width = props.width || 60;
  const ih = props.iconSize
    ? props.iconSize
    : props.height
    ? props.height * (5 / 6)
    : 50;
  const iw = ih;
  const iconColor = props.iconColor
    ? props.iconColor.color
    : THEME_COLORS.dark[800].color;
  return (
    <View style={styles.outer}>
      <ColorBox
        underline={props.underline}
        width={width}
        height={height}
        color={props.color}
        pressable={!props.disabled}
        onPress={props.onPress}
        flex={!!props.labelProps}
        leftAlign={!!props.labelProps}
      >
        <View style={[styles.inner]}>
          <Icon name={props.icon} fill={iconColor} height={ih} width={iw} />
          {props.labelProps && (
            <>
              <View style={{ width: 5 }} />
              <LabelText {...props.labelProps} />
            </>
          )}
        </View>
      </ColorBox>
    </View>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  inner: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  outer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});
