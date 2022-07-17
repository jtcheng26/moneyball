import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SessionRecap } from "../components/game-controllers/SoloPracticeController";
import { configFromCode, GameConfig } from "../configs/gameConfig.types";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { useTailwind } from "tailwind-rn/dist";
import { THEME_COLORS } from "../theme";
import TitleText from "../components/lib/text/TitleText";
import Scoreboard from "../components/lib/scoreboard/Scoreboard";
import ConfirmButton from "../components/lib/buttons/ConfirmButton";
import SaveVideoPreview from "../components/save-video-preview/SaveVideoPreview";
import LabelText from "../components/lib/text/LabelText";
import SummaryStat from "../components/lib/summary-stat/SummaryStat";
import FadeHeader from "../components/lib/spacing/FadeHeader";
import { OrientationLocker } from "react-native-orientation-locker";

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
      <OrientationLocker orientation="PORTRAIT" />
      <SafeAreaView>
        <FadeHeader style={[styles.header, tw("px-8")]}>
          <View style={styles.titleBar}>
            <TitleText text="Session Recap" />
            <ConfirmButton onConfirm={props.onConfirm} />
          </View>
          <View style={{ height: 20 }} />
          <Scoreboard
            scores={[props.recap.make, props.recap.miss]}
            title={configFromCode[props.recap.mode].name}
            timeLeft={props.recap.time}
            active
            underline
          />
        </FadeHeader>
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
          {props.video && props.thumbnail ? (
            <View style={styles.section}>
              <LabelText text="VIDEO" size={24} color={THEME_COLORS.dark[0]} />
              <View style={{ height: 10 }} />

              <SaveVideoPreview
                video={props.video}
                thumbnail={props.thumbnail}
                location="Home"
              />
            </View>
          ) : (
            <View />
          )}
          <View style={styles.section}>
            <LabelText text="STATS" size={24} color={THEME_COLORS.dark[0]} />
            <View style={{ height: 10 }} />
            <SummaryStat
              stat={
                Math.floor(
                  100 *
                    (props.recap.make /
                      Math.max(1, props.recap.make + props.recap.miss))
                ) + "%"
              }
              title="Shooting Percentage"
              status="GOOD"
              underline
            />
            <View style={{ height: 10 }} />
            <SummaryStat
              stat={props.recap.make + props.recap.miss}
              title="Shots Taken"
              status="NEUTRAL"
              underline
            />
            <View style={{ height: 10 }} />
            <SummaryStat
              stat={
                Math.floor((10 * props.recap.make) / (props.recap.time / 60)) /
                10
              }
              title="Shots made per minute"
              status="BAD"
              underline
            />
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
    marginTop: 30,
  },
  section: {
    paddingTop: 70,
    display: "flex",
    flexDirection: "column",
    // width: "100%",
  },
});
