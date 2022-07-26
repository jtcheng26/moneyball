import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Dialog from "./Dialog";
import IconButton from "../buttons/icon-button/IconButton";
import { THEME_COLORS } from "../../../theme";
import CancelButton from "../buttons/CancelButton";
import ConfirmButton from "../buttons/ConfirmButton";
import ColorBox from "../color-box/ColorBox";
import LabelText from "../text/LabelText";
import TokenButton from "../../currency-button/TokenButton";
import SideIconButton from "../buttons/side-icon-button/SideIconButton";
import TextInputBox from "../input/TextInput";

type Props = {
  title: string;
  body?: string;
  onConfirm?: (args: LandArgs) => void;
  onCancel?: () => void;
};

export type LandArgs = {
  latitude: string;
  longitude: string;
  name: string;
  image: string;
};

const CreateCourtDialog = (props: Props) => {
  const [args, setArgs] = useState({
    latitude: "33.98279",
    longitude: "-118.47229",
    name: "Venice Beach Courts",
    image: "",
  });
  return (
    <Dialog
      title="Details"
      body={props.body}
      bigFont
      bannerText="New Court"
      bannerColor={THEME_COLORS.theme[400]}
      onClose={props.onCancel}
      noMargin
    >
      <View style={styles.options}>
        <TextInputBox
          label="Court Name"
          bgColor={THEME_COLORS.dark[800]}
          text={args.name}
          onChange={(name: string) => setArgs({ ...args, name: name })}
          compact
        />
        <TextInputBox
          label="Image URL or IPFS CID"
          bgColor={THEME_COLORS.dark[800]}
          text={args.image}
          onChange={(image: string) => setArgs({ ...args, image: image })}
          placeholder="Type or paste here..."
          compact
        />
        <TextInputBox
          label="Latitude"
          bgColor={THEME_COLORS.dark[800]}
          text={args.latitude}
          onChange={(latitude: string) =>
            setArgs({ ...args, latitude: latitude })
          }
          placeholder="Type or paste here..."
          compact
        />
        <TextInputBox
          label="Longitude"
          bgColor={THEME_COLORS.dark[800]}
          text={args.longitude}
          onChange={(longitude: string) =>
            setArgs({ ...args, longitude: longitude })
          }
          placeholder="Type or paste here..."
          compact
        />
      </View>
      <View
        style={[
          styles.container,
          {
            justifyContent: "center",
          },
        ]}
      >
        <SideIconButton
          text="1000"
          icon="CoinSolid"
          height={45}
          color={THEME_COLORS.green[500]}
          transparent
          size={30}
        />
        <View style={{ width: 20 }} />
        <ColorBox
          color={THEME_COLORS.green[500]}
          underline
          width={150}
          height={60}
          pressable
          onPress={() => {
            if (props.onConfirm) {
              props.onConfirm(args);
            }
          }}
        >
          <LabelText text="BUY" color={THEME_COLORS.dark[800]} />
        </ColorBox>
      </View>
    </Dialog>
  );
};

export default CreateCourtDialog;

const styles = StyleSheet.create({
  container: {
    marginLeft: "auto",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  options: {
    display: "flex",
    flexDirection: "column",
    paddingTop: 10,
    paddingBottom: 20,
    // width: "100%",
  },
});
