import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { ThemeColor, THEME_COLORS } from "../../../../theme";
import ColorBox from "../../color-box/ColorBox";
import LabelText, { LabelTextProps } from "../../text/LabelText";
import Icon from "../icon-button/Icon";

type Props = {
  icon: string;
  text: string;
  color: ThemeColor;
  underline?: boolean;
  height: number;
  labelProps?: Partial<LabelTextProps>;
};

const SideIconButton = (props: Props) => {
  return (
    <View style={styles.container}>
      <View style={{ marginRight: 10 }}>
        <Icon
          name={props.icon}
          height={props.height * (2 / 3)}
          width={props.height * (2 / 3)}
          fill={props.color.color}
        />
      </View>
      <ColorBox
        color={props.color}
        flex
        width={50}
        height={props.height}
        leftAlign
        underline={props.underline}
      >
        <LabelText
          text={props.text}
          color={THEME_COLORS.dark[800]}
          {...props.labelProps}
        />
      </ColorBox>
    </View>
  );
};

export default SideIconButton;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});
