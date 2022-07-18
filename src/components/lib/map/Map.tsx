import { StyleSheet, Text, View } from "react-native";
import React, { useRef } from "react";
import MapView, { Marker, LatLng, AnimatedRegion } from "react-native-maps";
import mapStyle from "./style.json";
import Icon from "../buttons/icon-button/Icon";
import { THEME_COLORS } from "../../../theme";
// import { useAnimatedProps } from "react-native-reanimated";

type Props = {
  onMarkerPress: (marker: CourtMarker) => void;
  selected?: string;
  // coordinates: LatLng;
};

export interface CourtMarker {
  latlng: LatLng;
  id: string;
  title: string;
  description: string;
}

const markers: CourtMarker[] = [
  {
    id: "test",
    latlng: {
      latitude: 38,
      longitude: -122,
    },
    title: "Test title",
    description: "test description",
  },
];

const Map = (props: Props) => {
  // const loc = useAnimatedProps()
  const ref = useRef();
  return (
    <View style={StyleSheet.absoluteFill}>
      <MapView
        ref={ref}
        showsUserLocation
        followsUserLocation
        mapType="mutedStandard"
        userInterfaceStyle="dark"
        showsPointsOfInterest={false}
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        // customMap
      >
        {markers.map((marker, idx) => (
          <Marker
            key={idx}
            coordinate={marker.latlng}
            onPress={() => {
              if (props.selected !== marker.id) {
                ref.current.animateToRegion(
                  {
                    latitude: marker.latlng.latitude,
                    longitude: marker.latlng.longitude,
                    latitudeDelta: 0.03,
                    longitudeDelta: 0.03,
                  },
                  500
                );
              }
              props.onMarkerPress(marker);
            }}
            // title={marker.title}
            // description={marker.description}
          >
            <Icon
              width={40}
              height={40}
              name="BasketballHoop"
              fill={
                props.selected && marker.id === props.selected
                  ? THEME_COLORS.theme[500].color
                  : !props.selected
                  ? THEME_COLORS.theme[400].color
                  : THEME_COLORS.dark[500].color
              }
            />
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
