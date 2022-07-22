import React from "react";
export type VisualCurrencyUpdate = {
  tix?: number;
  tokens?: number;
  trophies?: number;
};
export const VisualCurrencyCtx = React.createContext({
  tix: 0,
  tokens: 0,
  trophies: 0,
  upd: (upd: VisualCurrencyUpdate) => {},
});
