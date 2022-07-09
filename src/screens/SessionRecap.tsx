import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SessionRecap } from "../components/game-controllers/SoloPracticeController";
import { GameConfig } from "../configs/gameConfig.types";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { useTailwind } from "tailwind-rn/dist";
import { THEME_COLORS } from "../theme";
import TitleText from "../components/lib/text/TitleText";
import Scoreboard from "../components/lib/scoreboard/Scoreboard";
import ConfirmButton from "../components/lib/buttons/ConfirmButton";
import SaveVideoPreview from "../components/save-video-preview/SaveVideoPreview";
import LabelText from "../components/lib/text/LabelText";

type Props = {
  recap: SessionRecap;
  video?: string;
  thumbnail?: string;
  modeConfig: GameConfig;
  onConfirm: () => void;
};

const SessionRecapScreen = (props: Props) => {
  const tw = useTailwind();
  return (
    <View style={styles.big}>
      <SafeAreaView>
        <View style={[styles.header, tw("px-8")]}>
          <View style={styles.titleBar}>
            <TitleText text="Session Recap" />
            <ConfirmButton onConfirm={props.onConfirm} />
          </View>
          <View style={{ height: 20 }} />
          <Scoreboard
            scores={[props.recap.make, props.recap.miss]}
            title="Solo practice"
            timeLeft={props.recap.time}
            active
            underline
          />
        </View>
        <ScrollView
          contentContainerStyle={[
            styles.container,
            tw("px-8"),
            {
              backgroundColor: THEME_COLORS.dark[800].color,
              paddingVertical: 20,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <LabelText text="VIDEO" size={24} color={THEME_COLORS.dark[0]} />
            <View style={{ height: 10 }} />
            {props.video && props.thumbnail && (
              <SaveVideoPreview
                video={props.video}
                thumbnail={props.thumbnail}
                location="Home"
              />
            )}
          </View>
          <View style={styles.section}>
            <LabelText text="STATS" size={24} color={THEME_COLORS.dark[0]} />
            <View style={{ height: 10 }} />
            {props.video && props.thumbnail && (
              <SaveVideoPreview
                video={props.video}
                thumbnail={props.thumbnail}
                location="Home"
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default SessionRecapScreen;

const styles = StyleSheet.create({
  big: {
    height: "100%",
    backgroundColor: THEME_COLORS.dark[800].color,
    width: "100%",
  },
  container: {
    width: "100%",
    // height: 1000,
    flexGrow: 1,
    // height: "100%",
    // display: "flex",
    // flexDirection: "column",
    paddingTop: 240,
  },
  titleBar: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  header: {
    position: "absolute",
    top: 0,
    paddingTop: 80,
    zIndex: 10,
    backgroundColor: THEME_COLORS.dark[800].color,
    shadowColor: THEME_COLORS.dark[800].color,
    shadowOffset: {
      width: 0,
      height: 40,
    },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  section: {
    paddingTop: 70,
    display: "flex",
    flexDirection: "column",
    // width: "100%",
  },
});
