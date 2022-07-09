import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { ThemeColor, THEME_COLORS } from "../../../theme";
import ColorBox from "../color-box/ColorBox";
import ButtonText from "../text/ButtonText";

type Props = {
  color: ThemeColor;
  buttonText?: string;
  buttonIcon?: string;
  children?: React.ReactNode;
  width: number;
  height: number;
  onPress?: () => void;
  pressable?: boolean;
};

const GameCard = (props: Props) => {
  const [pressed, setPressed] = useState(false);
  const customContainer = {
    width: props.width || 200,
    height: props.height || 200,
    backgroundColor: pressed
      ? THEME_COLORS.dark[200].color
      : THEME_COLORS.dark[500].color,
  };
  return (
    <Pressable
      disabled={!props.pressable}
      onPressIn={() => {
        if (props.pressable) {
          setPressed(true);
        }
      }}
      onPressOut={() => setPressed(false)}
      onPress={() => {
        if (props.onPress) props.onPress();
      }}
    >
      <View style={[customContainer, styles.container]}>
        <View
          style={[{ height: (props.height * 4) / 5 }, styles.childrenContainer]}
        >
          {props.children}
        </View>
        <View style={styles.button}>
          <ColorBox
            color={props.color}
            width={props.width}
            height={props.height / 5}
            underline
            leftAlign
          >
            <ButtonText
              text={props.buttonText ? props.buttonText : ""}
              size={14}
            />
          </ColorBox>
        </View>
      </View>
    </Pressable>
  );
};

export default GameCard;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },
  childrenContainer: {
    // flexGrow: 1,
  },
  button: {
    marginTop: "auto",
  },
});
