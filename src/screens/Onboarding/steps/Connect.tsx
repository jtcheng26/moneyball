import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TitleText from "../../../components/lib/text/TitleText";
import BodyText from "../../../components/lib/text/BodyText";
import ColorBox from "../../../components/lib/color-box/ColorBox";
import ButtonText from "../../../components/lib/text/ButtonText";
import { THEME_COLORS } from "../../../theme";

type Props = {
  onPress: () => void;
};

const ConnectStep = (props: Props) => {
  return (
    <>
      <TitleText text="LOGIN" />
      <BodyText>Log in using a crypto wallet. It's easy to make one!</BodyText>
      <View style={{ height: 40 }} />
      <ColorBox
        color={THEME_COLORS.theme[400]}
        underline
        pressable
        onPress={props.onPress}
        height={60}
        width={60}
        flex
        leftAlign
      >
        <ButtonText text="Login with WalletConnect" size={16} />
      </ColorBox>
    </>
  );
};

export default ConnectStep;

const styles = StyleSheet.create({});
