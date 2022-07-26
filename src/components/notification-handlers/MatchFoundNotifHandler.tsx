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
import LabelText from "../lib/text/LabelText";
import IconButton from "../lib/buttons/icon-button/IconButton";
import { THEME_COLORS } from "../../theme";

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
  const [notifs, setNotifs] = useState<RawNotification[]>([]);
  const { data: rawNotifs } = useNotifs();

  const onGameFound = useCallback(
    (match: RawMatch, notifType: NotificationCode) => {
      props.onNotif(match, notifType);
    },
    [props.onNotif]
  );

  function clearNotifs() {
    setNotifs([]);
  }

  const conn = useWalletConnect();

  const nextNotif = useCallback(() => {
    if (notifs.length >= 1) setNotifs(notifs.slice(1));
  }, [notifs]);

  useEffect(() => {
    if (rawNotifs && rawNotifs.length > 0) {
      // const processed = rawNotifs
      // .filter((notif: RawNotification) => notif.code === rawNotifs[0]["code"])
      // .map((notif: RawNotification) => notif.data as RawMatch);
      setNotifs(notifs.concat(rawNotifs));
    }
  }, [rawNotifs]);

  const notifType = useMemo(() => {
    return notifs && notifs.length > 0
      ? notifs[0].code
      : NotificationCode.GAME_START;
  }, [notifs]);

  useMemo(() => {
    if (notifs && notifs.length > 0) {
      setTimeout(() => {
        onGameFound(notifs[0].data, notifs[0].code);
      }, 400);
    }
  }, [notifs]);

  const config = useMemo(
    () =>
      notifs.length > 0
        ? configFromCode[notifs[0].data.mode_id]
        : RankedMatchConfig,
    [notifs]
  );

  return (
    <DarkenedModal
      visible={props.modalReady && notifs && notifs.length > 0}
      onDismiss={nextNotif}
    >
      {notifs && notifs.length > 0 && (
        <>
          {notifType === NotificationCode.GAME_START ? (
            <ActiveGameDialog
              game={notifs[0].data}
              bannerText={"MATCH FOUND"}
              config={config}
              onCancel={clearNotifs}
              onConfirm={(config: GameConfig, game?: RawMatch) => {
                nextNotif();
                props.startGame(config, game);
              }}
              userID={conn.accounts[0]}
            />
          ) : notifType === NotificationCode.GAME_END ? (
            <FinishedGameDialog
              game={notifs[0].data}
              config={config}
              onCancel={clearNotifs}
              onSave={() => {
                // setTimeout(() => {
                //   onGameFound(notifs[0].data, notifs[0].code);
                // }, 400);
              }}
              userID={conn.accounts[0]}
              onPress={(config: GameConfig, result: MatchResults) => {
                nextNotif();
                props.showRecent(config, result);
              }}
            />
          ) : notifs.length > 1 ? (
            <View style={{ marginTop: 10 }}>
              <LabelText
                text={`${notifs.length - 1} more notification${
                  notifs.length === 2 ? "" : "s"
                }`}
                color={THEME_COLORS.dark[200]}
              />
            </View>
          ) : (
            <View />
          )}
        </>
      )}
    </DarkenedModal>
  );
};

export default MatchFoundNotifHandler;

const styles = StyleSheet.create({});
