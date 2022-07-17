import { View, Text } from "react-native";
import React from "react";
import ProfileButton from "../lib/profile-button/ProfileButton";
import { THEME_COLORS } from "../../theme";

type Props = {
  name: string;
  trophies: number;
  icon: string;
  onPress?: () => void;
};

// seen at top of 'Play' screen
const ProfilePill = (props: Props) => {
  return (
    <ProfileButton
      name={props.name}
      trophies={props.trophies}
      icon={props.icon}
      color={THEME_COLORS.theme[400]}
      score={20}
      height={60}
      width={"100%"}
      onPress={props.onPress}
    />
  );
};

export default ProfilePill;
