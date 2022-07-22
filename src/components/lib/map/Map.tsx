import { StyleSheet, Text, View } from "react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import MapView, { Marker, LatLng, AnimatedRegion } from "react-native-maps";
import mapStyle from "./style.json";
import Icon from "../buttons/icon-button/Icon";
import { THEME_COLORS } from "../../../theme";
import useLocations from "../../../hooks/useLocations";
import { CourtLocation, LocationCoordinates } from "../../../data/data.types";
import { useSharedValue } from "react-native-reanimated";
import useCurrentLocation from "../../../hooks/useCurrentLocation";
import ReactNativeModal from "react-native-modal";
import CourtCarousel from "../../carousels/CourtCarousel";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import Game from "../../../screens/Game";
import { GameConfig } from "../../../configs/gameConfig.types";
import { SessionRecap } from "../../game-controllers/SoloPracticeController";
import DarkenedModal from "../dialogs/DarkenedModal";
import KotcChallengeResultDialog from "../dialogs/KotcChallengeResultDialog";
// import { useAnimatedProps } from "react-native-reanimated";

type Props = {
  onMarkerPress: (marker: CourtLocation) => void;
  selected?: string;
  clearMarker: () => void;
  // coordinates: LatLng;
};

const Map = (props: Props) => {
  // const loc = useAnimatedProps()
  const ref = useRef();
  const { data: courts, isSuccess: courtsLoaded } = useLocations();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const loc = useCurrentLocation();
  const distance = useCallback(
    (coords: LocationCoordinates) => {
      const dx = coords.latitude - loc.latitude;
      const dy = coords.longitude - loc.longitude;
      return dx * dx + dy * dy;
    },
    [loc]
  );
  const courtsSorted = useMemo(() => {
    if (courts && courts.length) {
      return courts.sort((a, b) => {
        return distance(a.coordinates) - distance(b.coordinates);
      });
    } else {
      return [];
    }
  }, [courts, distance]);
  const conn = useWalletConnect();
  function onSelect(court: CourtLocation) {
    if (props.selected !== court.name) {
      // TODO: use actual id
      ref.current.animateToRegion(
        {
          latitude: court.coordinates.latitude - 0.006,
          longitude: court.coordinates.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        },
        500
      );
    }
    props.onMarkerPress(court);
  }
  function onDismiss() {
    props.clearMarker();
  }
  const cardVisible = useMemo(() => {
    return !!props.selected;
  }, [props.selected]);

  // GAME STUFF ------------------------------
  const [game, setGame] = useState(false);
  const [gameConfig, setGameConfig] = useState<GameConfig | undefined>();
  const [gameMarker, setGameMarker] = useState(courts ? courts[0] : undefined);
  const [animateClose, setAnimateClose] = useState(true);
  const [results, setResults] = useState<SessionRecap | undefined>();
  function showResultModal(recap: SessionRecap) {
    setResults(recap);
  }
  function closeResultModal() {
    setResults(undefined);
    if (gameMarker) {
      setTimeout(() => {
        props.onMarkerPress(gameMarker);
      }, 400);
    }
  }
  function endGame(recap?: SessionRecap) {
    setAnimateClose(false);
    setTimeout(() => {
      setGame(false);
      if (gameMarker && !recap) props.onMarkerPress(gameMarker);
      else if (!!recap) {
        showResultModal(recap);
      }
    }, 500);
  }
  function startGame(config: GameConfig, location: CourtLocation) {
    setAnimateClose(true);
    setGameMarker(location);
    props.clearMarker();
    setGameConfig(config);
    setTimeout(() => {
      setGame(true);
    }, 500);
  }
  // -----------------------------------------
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
          latitude: 34.045,
          longitude: -118.4649,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        // customMap
      >
        {courtsSorted.map((marker, idx) => (
          <Marker
            key={idx}
            coordinate={marker.coordinates}
            onPress={() => {
              setSelectedIdx(idx);
              onSelect(marker);
            }}
            // title={marker.title}
            // description={marker.description}
          >
            <Icon
              width={props.selected && marker.name === props.selected ? 60 : 40}
              height={
                props.selected && marker.name === props.selected ? 60 : 40
              }
              name="BasketballHoop"
              fill={
                props.selected && marker.name === props.selected
                  ? THEME_COLORS.theme[500].color
                  : !props.selected
                  ? THEME_COLORS.theme[400].color
                  : THEME_COLORS.dark[200].color
              }
            />
          </Marker>
        ))}
      </MapView>
      <DarkenedModal visible={!!results} onDismiss={closeResultModal}>
        <KotcChallengeResultDialog
          location={gameMarker}
          win={true} // temp
          onCancel={closeResultModal}
          userID={conn.accounts[0]}
          score={10}
        />
      </DarkenedModal>
      <ReactNativeModal
        isVisible={cardVisible}
        onBackdropPress={onDismiss}
        onDismiss={onDismiss}
        supportedOrientations={["portrait"]}
        hideModalContentWhileAnimating
        style={{ margin: 0 }}
        useNativeDriver
        backdropOpacity={0}
        animationInTiming={500}
        // coverScreen={false}
      >
        <CourtCarousel
          courts={courtsSorted}
          userID={conn.accounts[0]}
          onSelect={onSelect}
          startGame={startGame}
          selected={selectedIdx}
        />
      </ReactNativeModal>
      {game && gameConfig && (
        <Game
          location={gameMarker?.name}
          active={animateClose}
          modeConfig={gameConfig}
          endSession={endGame}
        />
      )}
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
