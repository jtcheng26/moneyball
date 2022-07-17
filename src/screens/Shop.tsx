import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWithHeaders from "./ScreenWithHeaders";
import ScrollScreen from "../components/lib/spacing/ScrollScreen";
import TitleText from "../components/lib/text/TitleText";
import PaddedView from "../components/lib/spacing/PaddedView";
import PurchaseButton from "../components/purchase/PurchaseButton";

type Props = {};

const Shop = (props: Props) => {
  return (
    <ScreenWithHeaders>
      <ScrollScreen>
        <View style={styles.section}>
          <PaddedView>
            <TitleText text="Shop" />
            <View style={{ height: 20 }} />
            <PurchaseButton
              amount={100}
              price={120}
              currency="BALL"
              width="100%"
            />
            <View style={{ height: 40 }} />
            <PurchaseButton
              amount={1000}
              price={1000}
              currency="BTT"
              width="100%"
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
