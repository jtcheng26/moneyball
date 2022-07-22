import { View, Text } from "react-native";
import React from "react";
import ProfileButton from "../lib/profile-button/ProfileButton";
import { THEME_COLORS } from "../../theme";

type Props = {
  name: string;
  trophies: number;
  icon: string;
  score?: number | string;
  status?: "GOOD" | "BAD" | "NEUTRAL";
  height?: number;
  king?: boolean;
};

// small seen in game results
const RecapProfile = (props: Props) => {
  return (
    <ProfileButton
      name={props.name}
      trophies={props.trophies}
      icon={props.icon}
      color={THEME_COLORS.theme[400]}
      status={props.status}
      score={props.score}
      height={props.height || 45}
      width={"100%"}
      dark
      king={props.king}
    />
  );
};

export default RecapProfile;
