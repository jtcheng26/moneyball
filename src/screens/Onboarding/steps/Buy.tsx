import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import TitleText from "../../../components/lib/text/TitleText";
import BodyText from "../../../components/lib/text/BodyText";
import ColorBox from "../../../components/lib/color-box/ColorBox";
import { THEME_COLORS } from "../../../theme";
import ButtonText from "../../../components/lib/text/ButtonText";
import TextInputBox from "../../../components/lib/input/TextInput";
import createUser from "../../../hooks/api/user";
import LabelText from "../../../components/lib/text/LabelText";
import TicketButton from "../../../components/currency-button/TicketButton";
import TokenButton from "../../../components/currency-button/TokenButton";
import PurchaseButton from "../../../components/purchase/PurchaseButton";

type Props = {
  onComplete: () => void;
};

const BuyStep = (props: Props) => {
  return (
    <>
      <TitleText text="Buy Tickets" />
      <View style={styles.section}>
        <BodyText>
          Tickets are used to play multiplayer and special event matches.
        </BodyText>
      </View>
      <View style={styles.section}>
        <TicketButton value={1000000} big />
      </View>
      <View style={styles.section}>
        <BodyText>
          By winning matches, you can earn BitTorrent Tokens (BTT). BTT is real
          crypto that can be exchanged for real value!
        </BodyText>
      </View>
      <View style={styles.section}>
        <TokenButton value={1000000} big />
      </View>
      <View style={styles.section}>
        <BodyText>
          Buy some tickets using BTT to get started! Note it might take some
          time for the transaction to complete and you may need to reload the
          app to see your Tickets.
        </BodyText>
      </View>
      <View style={{ height: 30 }} />
      <PurchaseButton
        amount={500}
        price={5000}
        currency="BTT"
        width="100%"
        onPurchase={props.onComplete}
      />
      <View style={{ height: 50 }} />
      <ColorBox
        color={THEME_COLORS.dark[500]}
        // underline
        pressable
        onPress={props.onComplete}
        height={60}
        width={60}
        flex
        leftAlign
      >
        <ButtonText color={THEME_COLORS.dark[200]} text="Buy Later" size={16} />
      </ColorBox>
    </>
  );
};

export default BuyStep;

const styles = StyleSheet.create({
  section: {
    marginVertical: 10,
  },
  // scroll: {
  //   marginTop: 250,
  // },
});
