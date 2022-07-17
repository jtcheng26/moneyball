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
  pressable?: boolean;
  onPress?: () => void;
  transparent?: boolean;
  size?: number;
};

const SideIconButton = (props: Props) => {
  return (
    <View style={styles.container}>
      <View style={{ marginRight: !props.transparent ? 10 : 5 }}>
        <Icon
          name={props.icon}
          height={props.height * (2 / 3)}
          width={props.height * (2 / 3)}
          fill={props.color.color}
        />
      </View>
      {!props.transparent ? (
        <ColorBox
          color={props.color}
          flex
          width={50}
          height={props.height}
          leftAlign
          underline={props.underline}
          pressable={props.pressable}
          onPress={props.onPress}
        >
          <LabelText
            text={props.text}
            size={props.size || undefined}
            color={THEME_COLORS.dark[800]}
            {...props.labelProps}
          />
        </ColorBox>
      ) : (
        <LabelText
          text={props.text}
          color={props.color}
          {...props.labelProps}
          size={props.size || undefined}
        />
      )}
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
