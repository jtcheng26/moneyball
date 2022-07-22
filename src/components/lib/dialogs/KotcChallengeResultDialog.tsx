import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { GameConfig } from "../../../configs/gameConfig.types";
import { CourtLocation, RawMatch } from "../../../data/data.types";
import ActiveGameCard from "../../game-button/ActiveGameCard";
import DialogBanner from "./DialogBanner";
import { THEME_COLORS } from "../../../theme";
import CourtCard from "../map/court-card/CourtCard";
import { SessionRecap } from "../../game-controllers/SoloPracticeController";
import TicketText from "../text/TicketText";
import SideIconButton from "../buttons/side-icon-button/SideIconButton";
import Icon from "../buttons/icon-button/Icon";
import TitleText from "../text/TitleText";
import BodyText from "../text/BodyText";
import ColorBox from "../color-box/ColorBox";
import LabelText from "../text/LabelText";
import useUserData from "../../../hooks/useUserData";

type Props = {
  onCancel: () => void;
  location?: CourtLocation;
  win: boolean;
  score: number;
  userID: string;
};

const KotcChallengeResultDialog = ({
  onCancel,
  location,
  win,
  score,
  userID,
}: Props) => {
  const { data: user } = useUserData();
  return (
    <View style={styles.container}>
      {win ? (
        <View style={styles.banner}>
          <Icon
            name="Crown"
            fill={THEME_COLORS.theme[400].color}
            width={44}
            height={44}
          />
          <View style={{ width: 10 }} />
          <TitleText text="Victory" size={40} />
        </View>
      ) : (
        <View style={styles.banner}>
          <Icon
            name="Crown"
            fill={THEME_COLORS.red[500].color}
            width={44}
            height={44}
          />
          <View style={{ width: 10 }} />
          <TitleText text="Defeat" size={40} />
        </View>
      )}
      {location && (
        <CourtCard
          king={win && !!user ? user : undefined}
          height={390}
          location={location}
          userID={userID}
          score={score}
        >
          <View style={styles.content}>
            {win ? (
              <View style={styles.income}>
                <BodyText>Avg Income</BodyText>
                <View style={{ height: 5 }} />
                <SideIconButton
                  icon={"Ticket"}
                  text={"+5/hr"}
                  color={THEME_COLORS.theme[400]}
                  height={36}
                  transparent
                />
              </View>
            ) : (
              <View />
            )}

            <ColorBox
              color={win ? THEME_COLORS.theme[400] : THEME_COLORS.dark[50]}
              underline={true}
              width={150}
              height={50}
              pressable={true}
              onPress={onCancel}
            >
              <LabelText text={"OK"} color={THEME_COLORS.dark[800]} />
            </ColorBox>
          </View>
        </CourtCard>
      )}
    </View>
  );
};

export default KotcChallengeResultDialog;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    // alignItems: "center",
    // paddingHorizontal: 10,
  },
  banner: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 5,
    zIndex: 100,
  },
  income: {
    display: "flex",
  },
  content: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
