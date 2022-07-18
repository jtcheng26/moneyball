import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import ScreenWithHeaders from "./ScreenWithHeaders";
import ScrollScreen from "../components/lib/spacing/ScrollScreen";
import Map, { CourtMarker } from "../components/lib/map/Map";

type Props = {};

const MapScreen = (props: Props) => {
  const [mark, setMark] = useState<CourtMarker>();
  function onMarkerPress(marker: CourtMarker) {
    if (mark && marker.id === mark.id) setMark(undefined);
    else setMark(marker);
  }
  return (
    <ScreenWithHeaders noFill>
      <ScrollScreen>
        <Map onMarkerPress={onMarkerPress} selected={mark ? mark.id : ""} />
      </ScrollScreen>
    </ScreenWithHeaders>
  );
  // return <Map />;
};

export default MapScreen;

const styles = StyleSheet.create({});
