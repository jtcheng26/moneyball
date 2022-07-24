import React from "react";
import LabelText from "./LabelText";
import { THEME_COLORS } from "../../../theme";

type Props = {
  entryFee: number | string;
  size?: number;
  bad?: boolean;
};

const TicketText = (props: Props) => {
  return (
    <LabelText
      text={props.entryFee}
      color={props.bad ? THEME_COLORS.red[500] : THEME_COLORS.theme[400]}
      icon="Ticket"
      size={props.size}
    />
  );
};

export default TicketText;
