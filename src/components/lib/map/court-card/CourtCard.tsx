import { Image, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import {
  CourtLocation,
  GameEvent,
  RawMatch,
  User,
} from "../../../../data/data.types";
import { GameConfig } from "../../../../configs/gameConfig.types";
import { THEME_COLORS } from "../../../../theme";
import CourtPoster from "./CourtPoster";
import useUser from "../../../../hooks/api/getUser";
import ProfilePill from "../../../profile/ProfilePill";
import RecapProfile from "../../../profile/RecapProfile";
import Icon from "../../buttons/icon-button/Icon";
import SideIconButton from "../../buttons/side-icon-button/SideIconButton";
import ColorBox from "../../color-box/ColorBox";
import LabelText from "../../text/LabelText";
import ActionBar from "./ActionBar";
import { KotcChallengeConfig } from "../../../../configs/kotcChallengeConfig";

type Props = {
  location: CourtLocation;
  onPlay?: (config: GameConfig, court: CourtLocation) => void;
  userID: string;
  king?: User;
  children?: React.ReactNode;
  height?: number;
  score?: number;
};

const CourtCard = ({
  location,
  onPlay,
  userID,
  king,
  children,
  height,
  score,
}: Props) => {
  const [dims, setDims] = useState<number[]>([0, 0]);
  const { data: user, refetch } = useUser(location.owner_id);
  useMemo(() => {
    refetch();
  }, [location]);
  return (
    <View
      style={[styles.container, { height: height || 370 }]}
      onLayout={(event) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        console.log(width, height);
        setDims([width, height]);
      }}
    >
      <CourtPoster
        uri={location.image}
        width={dims[0]}
        height={(2 / 3) * dims[0]}
        name={location.name}
      />
      {/* <Text>{user ? user.name : "hello"}</Text> */}
      <View style={styles.content}>
        {/* <Icon name="Crown" fill={THEME_COLORS.theme[400].color} /> */}
        {!!user && (
          <RecapProfile
            name={king ? king.name : user.name}
            trophies={king ? king.trophies : user.trophies}
            icon={"Crown"}
            king
            score={score}
            status={king ? "GOOD" : "BAD"}
          />
        )}
        {!!children ? (
          children
        ) : location.event === GameEvent.TICKET_EVENT ? (
          <ActionBar
            text="PLAY"
            color={THEME_COLORS.theme[400]}
            cost={"+10/shot"}
            icon="Ticket"
            onPress={() => {
              if (onPlay) onPlay(KotcChallengeConfig, location);
            }}
          />
        ) : location.event === GameEvent.NO_EVENT ? (
          <ActionBar
            text="CHALLENGE"
            color={THEME_COLORS.green[500]}
            cost={location.challenge_cost + ""}
            icon="CoinSolid"
            onPress={() => {
              if (onPlay) onPlay(KotcChallengeConfig, location);
            }}
          />
        ) : null}
      </View>
    </View>
  );
};

export default CourtCard;

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
    width: "100%",
    backgroundColor: THEME_COLORS.dark[500].color,
    shadowColor: THEME_COLORS.dark[800].color,
    shadowOpacity: 1,
    shadowRadius: 10,
    borderBottomColor: THEME_COLORS.dark[500].underline,
    borderBottomWidth: 10,
  },
  content: {
    padding: 15,
  },
});
