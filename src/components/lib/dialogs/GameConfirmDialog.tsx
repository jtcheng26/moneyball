import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Dialog from "./Dialog";
import { THEME_COLORS } from "../../../theme";
import TicketText from "../text/TicketText";
import ColorBox from "../color-box/ColorBox";
import LabelText from "../text/LabelText";
import WagerSelect from "../input/WagerSelect";

type Props = {
  title: string;
  body: string;
  entryFee: number;
  wager?: boolean;
  onConfirm?: (fee?: number) => void;
  onCancel?: () => void;
  disabled?: boolean;
};

const GameConfirmDialog = (props: Props) => {
  const [wagerFee, setWagerFee] = useState(props.entryFee);
  return (
    <Dialog
      title={props.title}
      body={props.body}
      bigFont
      bannerText="Game Details"
      bannerColor={THEME_COLORS.theme[400]}
      onClose={props.onCancel}
    >
      {props.wager && <WagerSelect value={wagerFee} setValue={setWagerFee} />}

      <View
        style={[
          styles.container,
          {
            justifyContent: props.wager ? "center" : "flex-start",
          },
        ]}
      >
        {!props.wager && (
          <View style={styles.ticketContainer}>
            <TicketText
              entryFee={props.entryFee}
              size={26}
              bad={props.disabled}
            />
          </View>
        )}
        <ColorBox
          color={
            props.disabled ? THEME_COLORS.dark[200] : THEME_COLORS.theme[400]
          }
          underline={!props.disabled}
          width={props.wager ? 282 : 150}
          height={60}
          pressable={!props.disabled}
          onPress={
            !props.disabled
              ? () => {
                  if (props.onConfirm) {
                    if (props.wager) props.onConfirm(wagerFee);
                    else props.onConfirm();
                  }
                }
              : undefined
          }
        >
          <LabelText text="PLAY" color={THEME_COLORS.dark[800]} />
        </ColorBox>
      </View>
    </Dialog>
  );
};

export default GameConfirmDialog;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  ticketContainer: {
    flexGrow: 1,
  },
});
