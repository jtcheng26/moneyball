import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ColorBox from "../color-box/ColorBox";
import { ThemeColor, THEME_COLORS } from "../../../theme";
import TitleText from "../text/TitleText";
import LabelText from "../text/LabelText";
import BodyText from "../text/BodyText";
import IconButton from "../buttons/icon-button/IconButton";
import CancelButton from "../buttons/CancelButton";
import DialogBanner from "./DialogBanner";

type Props = {
  title: string;
  bigFont?: boolean;
  body?: string;
  children: React.ReactNode; // requires some confirmation
  onClose?: () => void;
  bannerText?: string;
  bannerColor?: ThemeColor;
};

const Dialog = (props: Props) => {
  return (
    <View style={styles.dialogContainer}>
      {props.bannerText && props.onClose && (
        <DialogBanner
          bannerText={props.bannerText}
          bannerColor={props.bannerColor}
          onClose={props.onClose}
        />
      )}
      <ColorBox color={THEME_COLORS.dark[500]} flex leftAlign>
        <View style={styles.container}>
          {props.bigFont ? (
            <TitleText
              text={props.title}
              color={THEME_COLORS.dark[0]}
              size={36}
            />
          ) : (
            <LabelText
              text={props.title.toUpperCase()}
              color={THEME_COLORS.dark[0]}
              size={26}
              flex
            />
          )}
          <View style={{ height: 10 }} />
          {props.body && (
            <BodyText color={THEME_COLORS.dark[50]}>{props.body}</BodyText>
          )}
          <View style={{ marginTop: 50 }}>{props.children}</View>
        </View>
      </ColorBox>
    </View>
  );
};

export default Dialog;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    padding: 15,
    width: "100%",
  },
  dialogContainer: {
    display: "flex",
    flexDirection: "column",
  },
});
