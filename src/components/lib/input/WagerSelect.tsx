import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useMemo, useState } from "react";
import TicketText from "../text/TicketText";
import TicketButton from "../../currency-button/TicketButton";
import LabelText from "../text/LabelText";
import BodyText from "../text/BodyText";
import { THEME_COLORS } from "../../../theme";
import SideIconButton from "../buttons/side-icon-button/SideIconButton";
import ColorBox from "../color-box/ColorBox";

type Props = {
  value: number;
  setValue: (value: number) => void;
};

const WagerSelect = (props: Props) => {
  const values = useMemo(() => {
    return [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
  }, []);
  const now = useMemo(() => {
    return values.indexOf(props.value);
  }, [props.value]);
  const up = useCallback(() => {
    if (now < values.length - 1) {
      props.setValue(values[now + 1]);
    }
  }, [now]);
  const down = useCallback(() => {
    if (now > 0) {
      props.setValue(values[now - 1]);
    }
  }, [now]);
  const upAvailable = useMemo(() => now < values.length - 1, [now]);
  const downAvailable = useMemo(() => now > 0, [now]);
  return (
    <View style={styles.container}>
      <LabelText size={15} text="Wager" />
      <View style={{ height: 5 }} />
      <View style={styles.wager}>
        <ColorBox
          color={upAvailable ? THEME_COLORS.green[500] : THEME_COLORS.dark[200]}
          width={50}
          height={50}
          underline
          onPress={up}
          pressable={upAvailable}
        >
          <LabelText text="+" size={30} />
        </ColorBox>
        <ColorBox
          color={THEME_COLORS.dark[800]}
          // flex
          leftAlign
          height={50}
          width={184}
        >
          <TicketText entryFee={props.value} />
        </ColorBox>
        <ColorBox
          color={downAvailable ? THEME_COLORS.red[500] : THEME_COLORS.dark[200]}
          width={50}
          height={50}
          underline
          onPress={down}
          pressable={downAvailable}
        >
          <LabelText text="-" size={30} />
        </ColorBox>
      </View>
    </View>
  );
};

export default WagerSelect;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingBottom: 20,
    display: "flex",
    flexDirection: "column",
  },
  scroll: {
    position: "absolute",
    top: 30,
    height: 100,
    backgroundColor: "#000000",
  },
  value: {},
  options: {
    display: "flex",
    flexDirection: "row",
  },
  wager: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
});
