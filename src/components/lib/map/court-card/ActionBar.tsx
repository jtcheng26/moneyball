import { StyleSheet, Text, View } from "react-native";
import React from "react";
import SideIconButton from "../../buttons/side-icon-button/SideIconButton";
import { ThemeColor, THEME_COLORS } from "../../../../theme";
import ColorBox from "../../color-box/ColorBox";
import LabelText from "../../text/LabelText";

type Props = {
  cost: string;
  text: string;
  icon: string;
  color: ThemeColor;
  onPress: () => void;
};

const ActionBar = (props: Props) => {
  return (
    <View style={styles.action}>
      <SideIconButton
        icon={props.icon}
        text={props.cost + ""}
        color={props.color}
        height={36}
        transparent
      />
      <View style={{ width: 15 }} />
      <ColorBox
        color={props.color}
        underline={true}
        width={150}
        height={40}
        pressable={true}
        onPress={props.onPress}
      >
        <LabelText text={props.text} color={THEME_COLORS.dark[800]} />
      </ColorBox>
    </View>
  );
};

export default ActionBar;

const styles = StyleSheet.create({
  action: {
    paddingTop: 15,
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-end",
  },
});
