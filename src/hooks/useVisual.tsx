import React, { useContext } from "react";
import { VisualCurrencyCtx } from "../contexts/visualCurrency";
import useTickets from "./useTickets";
import useTokens from "./useTokens";
import useTrophies from "./useTrophies";

export default function useVisualCurrency() {
  return useContext(VisualCurrencyCtx);
}
