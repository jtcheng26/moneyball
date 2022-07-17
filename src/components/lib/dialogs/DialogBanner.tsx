import { StyleSheet, Text, View } from "react-native";
import React from "react";
import LabelText from "../text/LabelText";
import CancelButton from "../buttons/CancelButton";
import { ThemeColor, THEME_COLORS } from "../../../theme";
import TitleText from "../text/TitleText";

type Props = {
  bannerText: string;
  onClose: () => void;
  bannerColor?: ThemeColor;
  iconColor?: ThemeColor;
  titleFont?: boolean;
};

const DialogBanner = (props: Props) => {
  const customBanner = {
    backgroundColor: props.bannerColor?.color,
    borderBottomWidth: 8,
    borderBottomColor: props.bannerColor?.underline,
  };
  return (
    <View style={[customBanner, styles.banner]}>
      {props.titleFont ? (
        <TitleText
          text={props.bannerText}
          color={THEME_COLORS.dark[500]}
          size={30}
        />
      ) : (
        <LabelText text={props.bannerText} color={THEME_COLORS.dark[500]} />
      )}
      <View style={styles.closeContainer}>
        <CancelButton
          size={40}
          color={props.iconColor ? props.iconColor : THEME_COLORS.red[500]}
          iconColor={THEME_COLORS.dark[0]}
          onCancel={props.onClose}
        />
      </View>
    </View>
  );
};

export default DialogBanner;

const styles = StyleSheet.create({
  banner: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeContainer: {
    marginLeft: "auto",
  },
});
