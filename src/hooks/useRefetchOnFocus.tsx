import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import { AppState, AppStateStatus } from "react-native";
import { focusManager } from "react-query";

focusManager.setEventListener((handleFocus) => {
  const listener = (state: AppStateStatus) => {
    handleFocus(state === "active");
  };
  AppState.addEventListener("change", listener);

  return () => {
    AppState.removeEventListener("change", listener);
  };
});

// via https://github.com/TanStack/query/discussions/296
export const useRefetchOnFocus = (refetch: () => void) => {
  useFocusEffect(refetch);
  /* Maybe subscribe to App state here too */
};
