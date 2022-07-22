import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { THEME_COLORS } from "../../../../theme";
import ButtonText from "../../text/ButtonText";
import Icon from "../../buttons/icon-button/Icon";
import LocationPill from "../../../location-pill/LocationPill";

type Props = {
  width: number;
  height: number;
  uri: string;
  name: string;
};

const CourtPoster = (props: Props) => {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: props.uri,
          width: props.width,
          height: props.height,
        }}
        height={200}
        width={200}
      />
      <View style={styles.banner}>
        {/* <Icon
          name="Crown"
          fill={THEME_COLORS.theme[400].color}
          width={40}
          height={40}
        /> */}
        {/* <View style={styles.bannerColor}>
          <ButtonText
            text={props.name}
            color={THEME_COLORS.dark[800]}
            size={props.name.length < 16 ? 26 : 20}
          />
        </View> */}
        <LocationPill big name={props.name} height={48} />
      </View>
    </View>
  );
};

export default CourtPoster;

const styles = StyleSheet.create({
  container: {
    borderBottomColor: THEME_COLORS.theme[50].color,
    borderBottomWidth: 6,
  },
  banner: {
    position: "absolute",
    bottom: 10,
    left: 10,

    // width: "100%",
    // height: "100%",
  },
  bannerColor: {
    marginTop: 3,
    padding: 7,
    backgroundColor: THEME_COLORS.theme[50].color,
  },
});
