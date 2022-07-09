import React from "react";
import LabelText from "./LabelText";
import { THEME_COLORS } from "../../../theme";

type Props = {
  entryFee: number;
  size?: number;
};

const TicketText = (props: Props) => {
  return (
    <LabelText
      text={props.entryFee}
      color={THEME_COLORS.theme[400]}
      icon="Ticket"
      size={props.size}
    />
  );
};

export default TicketText;
