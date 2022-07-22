import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import ScreenWithHeaders from "./ScreenWithHeaders";
import ScrollScreen from "../components/lib/spacing/ScrollScreen";
import TitleText from "../components/lib/text/TitleText";
import PaddedView from "../components/lib/spacing/PaddedView";
import PurchaseButton from "../components/purchase/PurchaseButton";
import useVisualCurrency from "../hooks/useVisual";

type Props = {};

const Shop = (props: Props) => {
  const { tokens, upd } = useVisualCurrency();
  return (
    <ScreenWithHeaders>
      <ScrollScreen>
        <View style={styles.section}>
          <PaddedView>
            <TitleText text="Shop" />
            <View style={{ height: 20 }} />
            <PurchaseButton
              amount={100}
              price={50000}
              currency="BALL"
              width="100%"
              onPurchase={() => {
                upd({ tokens: -50000, tix: 100 });
              }}
            />
            <View style={{ height: 40 }} />
            <PurchaseButton
              amount={1000}
              price={1000}
              currency="BTT"
              width="100%"
              onPurchase={() => {
                upd({ tix: 1000 });
              }}
            />
          </PaddedView>
        </View>
      </ScrollScreen>
    </ScreenWithHeaders>
  );
};

export default Shop;

const styles = StyleSheet.create({
  section: {
    marginTop: 50,
  },
});
