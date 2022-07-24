import { StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  MatchResults,
  NotificationCode,
  RawMatch,
} from "../../data/data.types";
import useNotifs from "../../hooks/useNotifs";
import type { RawNotification } from "../../data/data.types";
import DarkenedModal from "../lib/dialogs/DarkenedModal";
import ActiveGameCard from "../game-button/ActiveGameCard";
import { configFromCode, GameConfig } from "../../configs/gameConfig.types";
import DialogBanner from "../lib/dialogs/DialogBanner";
import { RankedMatchConfig } from "../../configs/rankedMatchConfig";
import ActiveGameDialog from "../lib/dialogs/ActiveGameDialog";
import { saveRawMatch } from "../../data/saveGame";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import FinishedGameDialog from "../lib/dialogs/FinishedGameDialog";

type Props = {
  onNotif: (match: RawMatch, notifType: NotificationCode) => void;
  startGame: (config: GameConfig, game?: RawMatch) => void;
  modalReady: boolean; // don't show modal when another is showing
  showRecent: (config: GameConfig, result: MatchResults) => void;
};

// const rawNotifs = JSON.parse(`[
//   {
//     "id": "62d2cbe36ac112a561ef3d86",
//     "created_at": "2022-07-16T14:32:03.582Z",
//     "updated_at": "2022-07-16T14:32:03.582Z",
//     "user_id": "0xa3d199f96535c98c716bbfd7f5a1a94fcb8170be",
//     "data": {
//       "_id": "62d2cbe36ac112a561ef3d84",
//       "created_at": "2022-07-16T10:32:03.495-04:00",
//       "id": "422189176802788960",
//       "mode_id": "ranked-match",
//       "players": [
//         {
//           "icon": "Basketball",
//           "id": "0xae531c39c1bb7c9f4a5ea1b523427f85c568ef71",
//           "name": "user 1",
//           "score": 2,
//           "scored": false,
//           "trophies": 0
//         },
//         {
//           "icon": "Basketball",
//           "id": "0xa3d199f96535c98c716bbfd7f5a1a94fcb8170be",
//           "name": "Jeff",
//           "score": 1,
//           "scored": false,
//           "trophies": 0
//         }
//       ],
//       "time_end": 1658068323,
//       "updated_at": "2022-07-16T10:32:03.495-04:00"
//     },
//     "code": 3
//   }
// ]`);

const MatchFoundNotifHandler = (props: Props) => {
  const [notifs, setNotifs] = useState<RawMatch[]>([]);
  const { data: rawNotifs } = useNotifs();
  const [notifType, setNotifType] = useState<NotificationCode>(
    NotificationCode.GAME_START
  );

  const onGameFound = useCallback(
    (matches: RawMatch[], notifType: NotificationCode) => {
      if (matches.length > 0) props.onNotif(matches[0], notifType);
    },
    [props.onNotif]
  );

  function clearNotifs() {
    setNotifs([]);
  }

  const conn = useWalletConnect();

  useEffect(() => {
    if (rawNotifs && rawNotifs.length > 0) {
      const processed = rawNotifs
        .filter((notif: RawNotification) => notif.code === rawNotifs[0]["code"])
        .map((notif: RawNotification) => notif.data as RawMatch);
      setNotifType(rawNotifs[0]["code"]);
      setNotifs(processed);
      onGameFound(processed, rawNotifs[0]["code"]);
    }
  }, [rawNotifs]);

  const config =
    notifs.length > 0 ? configFromCode[notifs[0].mode_id] : RankedMatchConfig;
  console.log(notifs, props.modalReady);
  return (
    <DarkenedModal
      visible={props.modalReady && notifs && notifs.length > 0}
      onDismiss={clearNotifs}
    >
      {notifs && notifs.length > 0 && (
        <>
          {notifType === NotificationCode.GAME_START && (
            <ActiveGameDialog
              game={notifs[0]}
              bannerText={"MATCH FOUND"}
              config={config}
              onCancel={clearNotifs}
              onConfirm={(config: GameConfig, game?: RawMatch) => {
                clearNotifs();
                props.startGame(config, game);
              }}
              userID={conn.accounts[0]}
            />
          )}
          {notifType === NotificationCode.GAME_END && (
            <FinishedGameDialog
              game={notifs[0]}
              config={config}
              onCancel={clearNotifs}
              onSave={onGameFound}
              userID={conn.accounts[0]}
              onPress={(config: GameConfig, result: MatchResults) => {
                clearNotifs();
                props.showRecent(config, result);
              }}
            />
          )}
        </>
      )}
    </DarkenedModal>
  );
};

export default MatchFoundNotifHandler;

const styles = StyleSheet.create({});
