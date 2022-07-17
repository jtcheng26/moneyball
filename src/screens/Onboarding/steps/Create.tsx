import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import TitleText from "../../../components/lib/text/TitleText";
import BodyText from "../../../components/lib/text/BodyText";
import ColorBox from "../../../components/lib/color-box/ColorBox";
import { THEME_COLORS } from "../../../theme";
import ButtonText from "../../../components/lib/text/ButtonText";
import TextInputBox from "../../../components/lib/input/TextInput";
import createUser from "../../../hooks/api/user";

type Props = {
  onComplete: () => void;
};

const CreateStep = (props: Props) => {
  const [name, setName] = useState("");
  async function submit() {
    await createUser(name, "Basketball");
    props.onComplete();
  }
  return (
    <>
      <TitleText text="ACCOUNT" />
      <BodyText>It seems you're new here. Pick a name!</BodyText>
      <View style={{ height: 30 }} />
      <View>
        <TextInputBox text={name} onChange={setName} />
      </View>
      <ColorBox
        color={THEME_COLORS.theme[400]}
        underline
        pressable
        onPress={submit}
        height={60}
        width={60}
        flex
        leftAlign
      >
        <ButtonText text="Confirm" size={16} />
      </ColorBox>
    </>
  );
};

export default CreateStep;

const styles = StyleSheet.create({});
