import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState } from "react";
import CameraRoll from "@react-native-community/cameraroll";
import LocationPill from "../location-pill/LocationPill";
import StandardIconButton from "../lib/buttons/StandardIconButton";
import { THEME_COLORS } from "../../theme";
import ConfirmButton from "../lib/buttons/ConfirmButton";

type Props = {
  video: string;
  thumbnail: string;
  location: string;
};

const SaveVideoPreview = (props: Props) => {
  // CameraRoll.save(props.thumbnail, { type: "photo" });
  const [dims, setDims] = useState<number[]>();
  const [saved, setSaved] = useState(false);
  function saveVideo() {
    CameraRoll.save(props.video, { type: "video" });
    setSaved(true);
  }
  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        console.log(width, height);
        setDims([width, height]);
      }}
    >
      {dims && (
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: props.thumbnail,
              width: dims[0],
              height: (1080 / 1920) * dims[0],
            }}
            height={200}
            width={200}
          />
        </View>
      )}
      <View style={{ height: 10 }} />
      <View style={styles.buttonRow}>
        {props.location ? (
          <LocationPill height={50} name={props.location} />
        ) : (
          <View />
        )}
        <View style={styles.shareButtons}>
          {!saved ? (
            <StandardIconButton icon="Save" onPress={saveVideo} />
          ) : (
            <ConfirmButton outline />
          )}
          <View style={{ width: 10 }} />
          <StandardIconButton icon="Share" />
        </View>
      </View>
    </View>
  );
};

export default SaveVideoPreview;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  buttonRow: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  shareButtons: {
    display: "flex",
    flexDirection: "row",
  },
  imageContainer: {
    borderBottomWidth: 10,
    borderBottomColor: THEME_COLORS.theme[50].color,
  },
});
