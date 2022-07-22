import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import ScreenWithHeaders from "./ScreenWithHeaders";
import ScrollScreen from "../components/lib/spacing/ScrollScreen";
import Map from "../components/lib/map/Map";
import { CourtLocation } from "../data/data.types";

type Props = {};

const MapScreen = (props: Props) => {
  const [mark, setMark] = useState<CourtLocation>();
  function onMarkerPress(marker: CourtLocation) {
    if (mark && marker.name === mark.name) setMark(undefined);
    else setMark(marker);
  }
  function clearMarker() {
    setMark(undefined);
  }
  return (
    <ScreenWithHeaders noFill>
      <ScrollScreen>
        <Map
          onMarkerPress={onMarkerPress}
          selected={mark ? mark.name : ""}
          clearMarker={clearMarker}
        />
      </ScrollScreen>
    </ScreenWithHeaders>
  );
  // return <Map />;
};

export default MapScreen;

const styles = StyleSheet.create({});
